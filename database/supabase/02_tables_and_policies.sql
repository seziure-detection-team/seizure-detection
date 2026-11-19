-- PATIENT table (ERD, Section 5.5): links configured manually by the team (Section 3.3.4, FW-01)
create table public.patient (
  patient_id   uuid primary key references public.profile(user_id) on delete cascade,
  caregiver_id uuid unique references public.profile(user_id) on delete set null,
  physician_id uuid references public.profile(user_id) on delete set null
);

-- SEIZURE_EVENT table
create table public.seizure_event (
  event_id            uuid primary key default gen_random_uuid(),
  patient_id          uuid not null references public.patient(patient_id) on delete cascade,
  start_time          timestamptz not null,
  duration_sec        integer not null check (duration_sec >= 0),
  confidence          real not null check (confidence between 0 and 1),
  signal_segment_path text,
  label               text not null default 'pending_review'
                      check (label in ('pending_review', 'confirmed_seizure', 'false_alarm'))
);

-- ALERT table: at most one alert per event
create table public.alert (
  alert_id        uuid primary key default gen_random_uuid(),
  event_id        uuid not null unique references public.seizure_event(event_id) on delete cascade,
  sent_at         timestamptz,
  delivery_status text not null default 'pending'
                  check (delivery_status in ('pending', 'sent', 'failed'))
);

alter table public.patient       enable row level security;
alter table public.seizure_event enable row level security;
alter table public.alert         enable row level security;

-- Helper: is the current user the caregiver linked to the patient of this event?
create or replace function public.is_linked_caregiver(p_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.seizure_event e
    join public.patient p on p.patient_id = e.patient_id
    where e.event_id = p_event_id
      and p.caregiver_id = auth.uid()
  );
$$;

-- PATIENT: each user sees only the link row that concerns them
create policy "Linked users can read patient row"
  on public.patient for select to authenticated
  using (auth.uid() in (patient_id, caregiver_id, physician_id));

-- PROFILE: physician can read the profiles of linked patients (NFR-05, FR-11)
create policy "Physician can read linked patient profiles"
  on public.profile for select to authenticated
  using (exists (
    select 1 from public.patient p
    where p.patient_id = profile.user_id
      and p.physician_id = auth.uid()
  ));

-- SEIZURE_EVENT: patient (own) and physician (linked patients)
create policy "Patient and physician can read events"
  on public.seizure_event for select to authenticated
  using (exists (
    select 1 from public.patient p
    where p.patient_id = seizure_event.patient_id
      and auth.uid() in (p.patient_id, p.physician_id)
  ));

-- SEIZURE_EVENT: caregiver reads only events that have an alert (FR-13 within NFR-05)
create policy "Caregiver can read events of own alerts"
  on public.seizure_event for select to authenticated
  using (
    exists (select 1 from public.alert a where a.event_id = seizure_event.event_id)
    and public.is_linked_caregiver(event_id)
  );

-- Patient can only change the label of their own events (FR-17)
revoke update on public.seizure_event from authenticated;
grant update (label) on public.seizure_event to authenticated;
create policy "Patient can label own events"
  on public.seizure_event for update to authenticated
  using (patient_id = auth.uid())
  with check (patient_id = auth.uid());

-- ALERT: only the caregiver linked to the patient of the event (NFR-05)
create policy "Caregiver can read own alerts"
  on public.alert for select to authenticated
  using (public.is_linked_caregiver(event_id));

-- Registration trigger: also add patients to the PATIENT table
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(new.raw_user_meta_data->>'role', '') not in ('patient', 'caregiver') then
    raise exception 'Invalid role';
  end if;

  insert into public.profile (user_id, full_name, email, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email,
          new.raw_user_meta_data->>'role');

  if new.raw_user_meta_data->>'role' = 'patient' then
    insert into public.patient (patient_id) values (new.id);
  end if;

  return new;
end;
$$;