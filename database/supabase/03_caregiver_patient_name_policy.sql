-- Caregiver can read the profile of their linked patient (patient name on C2)
create policy "Caregiver can read linked patient profile"
  on public.profile for select to authenticated
  using (exists (
    select 1 from public.patient p
    where p.patient_id = profile.user_id
      and p.caregiver_id = auth.uid()
  ));