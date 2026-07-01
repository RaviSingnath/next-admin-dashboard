create policy "view invitations not self invite"
on public.invitations
for select
using (

  public.is_super_admin()

  or (

    public.current_role() = 'college_admin'
    and college_id = public.current_college_id()

  )

  or (

    public.current_role() = 'supervisor'
    and role = 'student'
    and college_id = public.current_college_id()
    and department_id = public.current_department_id()

  )

  or id != auth.uid()
);