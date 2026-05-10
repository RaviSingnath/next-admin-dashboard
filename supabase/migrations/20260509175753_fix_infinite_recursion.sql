-- =====================================================
-- NEW HELPER FUNCTIONS
-- =====================================================

create or replace function public.current_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

revoke all on function public.current_role() from public;

grant execute
on function public.current_role()
to authenticated;

create or replace function public.current_college_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select college_id
  from public.profiles
  where id = auth.uid();
$$;

revoke all on function public.current_college_id() from public;

grant execute
on function public.current_college_id()
to authenticated;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
  );
$$;

revoke all on function public.is_super_admin() from public;

grant execute
on function public.is_super_admin()
to authenticated;


-- =====================================================
-- COLLEGES POLICIES
-- =====================================================

-- SELECT
create policy "super_admin_select_colleges"
on public.colleges
for select
to authenticated
using (
  public.is_super_admin()
);

-- INSERT
create policy "super_admin_insert_colleges"
on public.colleges
for insert
to authenticated
with check (
  public.is_super_admin()
);

-- UPDATE
create policy "super_admin_update_colleges"
on public.colleges
for update
to authenticated
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);

-- DELETE
create policy "super_admin_delete_colleges"
on public.colleges
for delete
to authenticated
using (
  public.is_super_admin()
);