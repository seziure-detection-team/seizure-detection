-- =====================================================================================
-- TEST DATA ONLY. This is NOT a migration.
--
-- Inserts 8 sample seizure events and 5 caregiver alerts for ONE patient account, matching
-- the sample data of the mobile app (mobile-app/src/mocks/events.js and alerts.js), so the
-- History (B5), Patterns (B6), Event detail (B7) and caregiver Alerts (C2) screens show the
-- same content when they read from the database.
--
-- How to use:
--   - Each team member runs it in their OWN Supabase project, from the SQL Editor.
--   - NEVER run it on a production project.
--   - Edit only the patient_email line below, then run the whole file.
--   - It is safe to run again: it deletes and re-inserts only its own 8 test events
--     (fixed IDs derived from the patient's user_id). Other events of the patient, and
--     all other data, are never touched. The alerts of these events are removed by the
--     existing ON DELETE CASCADE and inserted again.
--
-- It does not create, alter or drop any table, policy, function or trigger.
-- Times are the local times of the sample data, stored in Asia/Riyadh time (UTC+03:00).
-- =====================================================================================

do $$
declare
  patient_email text := 'patient@example.com';  -- <== EDIT THIS LINE ONLY

  v_user_id uuid;
  v_role    text;
  v_ids     uuid[];
begin
  -- 1. Find the patient account
  select p.user_id, p.role
    into v_user_id, v_role
    from public.profile p
   where lower(p.email) = lower(trim(patient_email));

  if v_user_id is null then
    raise exception 'Test data: no profile found for email "%". Register and verify the patient account first, then edit patient_email.', patient_email;
  end if;

  if v_role <> 'patient' then
    raise exception 'Test data: the account "%" has role "%", not "patient".', patient_email, v_role;
  end if;

  if not exists (select 1 from public.patient where patient_id = v_user_id) then
    raise exception 'Test data: no row in public.patient for "%". The account was probably created before 02_tables_and_policies.sql was applied; ask the team how to add the row.', patient_email;
  end if;

  -- 2. Deterministic IDs of the 8 test events (e1..e8) for this patient
  select array_agg(md5(v_user_id::text || '-test-e' || n)::uuid order by n)
    into v_ids
    from generate_series(1, 8) as n;

  -- 3. Remove only these test events (their alerts are removed by the cascade)
  delete from public.seizure_event
   where event_id = any (v_ids)
     and patient_id = v_user_id;

  -- 4. Events (same start times, durations and labels as mocks/events.js)
  insert into public.seizure_event
    (event_id, patient_id, start_time, duration_sec, confidence, signal_segment_path, label)
  values
    (v_ids[1], v_user_id, '2026-11-22 02:14:00+03',  72, 0.82, null, 'pending_review'),
    (v_ids[2], v_user_id, '2026-11-19 23:40:00+03',  48, 0.91, null, 'confirmed_seizure'),
    (v_ids[3], v_user_id, '2026-11-15 04:05:00+03', 123, 0.74, null, 'false_alarm'),
    (v_ids[4], v_user_id, '2026-11-09 19:22:00+03',  35, 0.88, null, 'confirmed_seizure'),
    (v_ids[5], v_user_id, '2026-11-02 03:51:00+03',  86, 0.71, null, 'false_alarm'),
    (v_ids[6], v_user_id, '2026-10-30 22:15:00+03',  52, 0.93, null, 'confirmed_seizure'),
    (v_ids[7], v_user_id, '2026-10-27 01:30:00+03',  65, 0.77, null, 'false_alarm'),
    (v_ids[8], v_user_id, '2026-10-13 21:48:00+03',  41, 0.86, null, 'confirmed_seizure');

  -- 5. Alerts for the first five events (as in mocks/alerts.js), sent 15 seconds after the
  --    end of each event (start_time + duration_sec + 15 s; within NFR-01)
  insert into public.alert (event_id, sent_at, delivery_status)
  select e.event_id,
         e.start_time + make_interval(secs => e.duration_sec + 15),
         'sent'
    from public.seizure_event e
   where e.event_id = any (v_ids[1:5]);

  raise notice 'Test data: 8 events and 5 alerts inserted for "%".', patient_email;
end $$;

-- The caregiver sees these alerts (C2) only after the caregiver account is linked to this
-- patient, i.e. public.patient.caregiver_id is set to the caregiver's user_id (the manual
-- link from the team guide). Without the link the caregiver sees the "no linked patient"
-- screen (C4), and the patient's History is not affected.
