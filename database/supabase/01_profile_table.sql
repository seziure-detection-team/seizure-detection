-- PROFILE table (ERD, Section 5.5)
create table public.profile (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null,
  email      text not null,
  role       text not null check (role in ('patient', 'caregiver', 'physician')),
  push_token text
);

-- Row-level security: each user reads only their own profile (NFR-05)
alter table public.profile enable row level security;

create policy "Users can read own profile"
  on public.profile for select
  to authenticated
  using (auth.uid() = user_id);

-- Create the profile automatically when a user registers
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
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'role'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();