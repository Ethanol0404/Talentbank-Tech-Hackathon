-- Supabase role-based registration hardening for UniOS.
-- Run this in the Supabase SQL editor after creating the persons, candidates,
-- universities, and employers tables described by the app schema.

alter table public.persons enable row level security;
alter table public.candidates enable row level security;
alter table public.universities enable row level security;
alter table public.employers enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'persons_role_check'
      and conrelid = 'public.persons'::regclass
  ) then
    alter table public.persons
      add constraint persons_role_check
      check (role::text in ('candidate', 'university', 'employer'));
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'persons_id_auth_users_fkey' and conrelid = 'public.persons'::regclass) then
    alter table public.persons add constraint persons_id_auth_users_fkey foreign key (id) references auth.users(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'candidates_id_persons_fkey' and conrelid = 'public.candidates'::regclass) then
    alter table public.candidates add constraint candidates_id_persons_fkey foreign key (id) references public.persons(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'universities_id_persons_fkey' and conrelid = 'public.universities'::regclass) then
    alter table public.universities add constraint universities_id_persons_fkey foreign key (id) references public.persons(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'employers_id_persons_fkey' and conrelid = 'public.employers'::regclass) then
    alter table public.employers add constraint employers_id_persons_fkey foreign key (id) references public.persons(id) on delete cascade;
  end if;
end $$;

create or replace function public.assert_person_role(expected_role text)
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.persons
    where id = new.id and role::text = expected_role
  ) then
    raise exception 'Role mismatch: %.id must reference a persons row with role %', tg_table_name, expected_role;
  end if;

  return new;
end;
$$;

create or replace function public.prevent_person_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role <> old.role and (
    exists (select 1 from public.candidates where id = old.id)
    or exists (select 1 from public.universities where id = old.id)
    or exists (select 1 from public.employers where id = old.id)
  ) then
    raise exception 'Cannot change role after a role-specific profile exists';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_candidate_role on public.candidates;
create trigger enforce_candidate_role before insert or update on public.candidates
for each row execute function public.assert_person_role('candidate');

drop trigger if exists enforce_university_role on public.universities;
create trigger enforce_university_role before insert or update on public.universities
for each row execute function public.assert_person_role('university');

drop trigger if exists enforce_employer_role on public.employers;
create trigger enforce_employer_role before insert or update on public.employers
for each row execute function public.assert_person_role('employer');

drop trigger if exists prevent_person_role_change on public.persons;
create trigger prevent_person_role_change before update of role on public.persons
for each row execute function public.prevent_person_role_change();

drop policy if exists "persons_select_own" on public.persons;
drop policy if exists "persons_insert_own" on public.persons;
drop policy if exists "persons_update_own_same_role" on public.persons;

create policy "persons_select_own" on public.persons
for select to authenticated
using (id = auth.uid());

create policy "persons_insert_own" on public.persons
for insert to authenticated
with check (id = auth.uid());

create policy "persons_update_own_same_role" on public.persons
for update to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role::text = (select existing_person.role::text from public.persons existing_person where existing_person.id = auth.uid())
);

drop policy if exists "candidates_select_own_role" on public.candidates;
drop policy if exists "candidates_insert_own_role" on public.candidates;
drop policy if exists "candidates_update_own_role" on public.candidates;

create policy "candidates_select_own_role" on public.candidates
for select to authenticated
using (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'candidate')
);

create policy "candidates_insert_own_role" on public.candidates
for insert to authenticated
with check (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'candidate')
);

create policy "candidates_update_own_role" on public.candidates
for update to authenticated
using (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'candidate')
)
with check (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'candidate')
);

drop policy if exists "universities_select_own_role" on public.universities;
drop policy if exists "universities_insert_own_role" on public.universities;
drop policy if exists "universities_update_own_role" on public.universities;

create policy "universities_select_own_role" on public.universities
for select to authenticated
using (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'university')
);

create policy "universities_insert_own_role" on public.universities
for insert to authenticated
with check (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'university')
);

create policy "universities_update_own_role" on public.universities
for update to authenticated
using (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'university')
)
with check (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'university')
);

drop policy if exists "employers_select_own_role" on public.employers;
drop policy if exists "employers_insert_own_role" on public.employers;
drop policy if exists "employers_update_own_role" on public.employers;

create policy "employers_select_own_role" on public.employers
for select to authenticated
using (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'employer')
);

create policy "employers_insert_own_role" on public.employers
for insert to authenticated
with check (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'employer')
);

create policy "employers_update_own_role" on public.employers
for update to authenticated
using (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'employer')
)
with check (
  id = auth.uid()
  and exists (select 1 from public.persons where id = auth.uid() and role::text = 'employer')
);

