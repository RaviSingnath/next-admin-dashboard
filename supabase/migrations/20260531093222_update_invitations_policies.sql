-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

create or replace function public.current_department_id()
returns uuid
language sql
stable
security definer
as $$
  select department_id
  from public.profiles
  where id = auth.uid();
$$;

-- =====================================================
-- INVITATIONS POLICIES
-- =====================================================

drop policy if exists "college admin create invitations"
on public.invitations;

create policy "create invitations"
on public.invitations
for insert
with check (

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
);

drop policy if exists "college admin view invitations"
on public.invitations;

create policy "view invitations"
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
);

drop policy if exists "college admin update invitations"
on public.invitations;

create policy "update invitations"
on public.invitations
for update
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
)
with check (

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
);