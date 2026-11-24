# Database
Supabase (PostgreSQL) table definitions and row-level security policies.

## Test data

`test-data/` holds SQL scripts that insert sample data for development and manual testing.
They are **not** migrations and must never be run on a production project.

`test-data/01_sample_events_and_alerts.sql` adds 8 sample seizure events and 5 caregiver
alerts for one patient account; the mobile app's History, Patterns, Event detail and
caregiver Alerts screens read them from the database. To run it:

1. Make sure the SQL files in `supabase/` are applied and the patient account is registered
   and verified.
2. Open the file, change only the `patient_email` line to the patient's email, and run the
   whole file in the SQL Editor of your own Supabase project.
3. To see the alerts as the caregiver, link the caregiver to the patient first
   (`public.patient.caregiver_id`), as described in the team guide.

The script can be run again: it replaces only its own 8 test events (fixed IDs per patient)
and never changes other events or data.
