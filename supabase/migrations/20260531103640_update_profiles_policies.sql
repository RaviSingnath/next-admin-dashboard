drop policy if exists "self read profile"
on public.profiles;

create policy "read profiles"
on public.profiles
for select
using (

  -- User can always see their own profile
  id = auth.uid()

  -- Super admin can see everything
  or public.is_super_admin()

  -- College admin can see everyone in their college
  or (
    public.current_role() = 'college_admin'
    and college_id = public.current_college_id()
  )

  -- Supervisor can only see students in their department
  or (
    public.current_role() = 'supervisor'
    and role = 'student'
    and college_id = public.current_college_id()
    and department_id = public.current_department_id()
  )
);

create policy "supervisor update students"
on public.profiles
for update
using (
  public.current_role() = 'supervisor'
  and role = 'student'
  and college_id = public.current_college_id()
  and department_id = public.current_department_id()
)
with check (
  public.current_role() = 'supervisor'
  and role = 'student'
  and college_id = public.current_college_id()
  and department_id = public.current_department_id()
);

-- We don't allow multiple supervisors within the same department.
-- Unique supervisor per department constraint
create unique index unique_supervisor_per_department
on public.profiles(department_id)
where role = 'supervisor'
  and deleted_at is null;