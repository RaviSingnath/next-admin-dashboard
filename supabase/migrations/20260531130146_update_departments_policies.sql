drop policy if exists "college scoped departments"
on public.departments;

create policy "read department/departments based on the role"
on public.departments
for select
using (

  -- Super Admin
  public.is_super_admin()

  -- College Admin can see all departments in their college
  or (
    public.current_role() = 'college_admin'
    and college_id = public.current_college_id()
  )

  -- Supervisor can only see their own department
  or (
    public.current_role() = 'supervisor'
    and id = public.current_department_id()
  )

  -- Student can only see their own department
  or (
    public.current_role() = 'student'
    and id = public.current_department_id()
  )
);