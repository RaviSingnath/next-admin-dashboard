-- =====================================================
-- PROFILES POLICIES
-- =====================================================

create policy "self read profile"
on public.profiles
for select
using (
  id = auth.uid()

  or public.is_super_admin()

  or (
    public.current_role() = 'college_admin'
    and college_id = public.current_college_id()
  )
);

create policy "college admin manage profiles"
on public.profiles
for all
using (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
)
with check (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
);

-- Optional:
-- Super Admin full access profile policy

create policy "super admin full access profiles"
on public.profiles
for all
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);

-- =====================================================
-- STUDENTS POLICIES
-- =====================================================

create policy "student self access"
on public.students
for select
using (
  profile_id = auth.uid()
);

create policy "college admin full student access"
on public.students
for all
using (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
)
with check (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
);

create policy "supervisor own students"
on public.students
for all
using (
  public.current_role() = 'supervisor'
  and college_id = public.current_college_id()
  and supervisor_id = auth.uid()
)
with check (
  public.current_role() = 'supervisor'
  and college_id = public.current_college_id()
  and supervisor_id = auth.uid()
);

-- Optional:
-- Super Admin full access student policy

create policy "super admin full access students"
on public.students
for all
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);

-- =====================================================
-- DEPARTMENTS POLICIES
-- =====================================================

create policy "college scoped departments"
on public.departments
for select
using (
  public.is_super_admin()

  or college_id = public.current_college_id()
);

create policy "college admin manage departments"
on public.departments
for all
using (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
)
with check (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
);

create policy "super admin full access departments"
on public.departments
for all
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);

-- =====================================================
-- PAYMENTS POLICIES
-- =====================================================

create policy "college scoped payments"
on public.payments
for select
using (
  public.is_super_admin()

  or college_id = public.current_college_id()
);

create policy "student own payments"
on public.payments
for select
using (
  exists (
    select 1
    from public.students s
    where s.id = student_id
      and s.profile_id = auth.uid()
  )
);

create policy "college admin manage payments"
on public.payments
for all
using (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
)
with check (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
);

-- =====================================================
-- AUDIT LOGS POLICIES
-- =====================================================

create policy "audit logs read"
on public.audit_logs
for select
using (
  public.is_super_admin()

  or public.current_role() = 'college_admin'
);

create policy "system insert audit logs"
on public.audit_logs
for insert
with check (
  auth.uid() is not null
);

-- IMPORTANT:
-- No UPDATE policy
-- No DELETE policy

-- This keeps audit logs append-only
-- which is the correct enterprise approach

-- =====================================================
-- INVITATIONS POLICIES
-- =====================================================

create policy "college admin view invitations"
on public.invitations
for select
using (
  public.is_super_admin()

  or (
    public.current_role() = 'college_admin'
    and college_id = public.current_college_id()
  )
);

create policy "college admin create invitations"
on public.invitations
for insert
with check (
  public.is_super_admin()

  or (
    public.current_role() = 'college_admin'
    and college_id = public.current_college_id()
  )
);

create policy "college admin update invitations"
on public.invitations
for update
using (
  public.is_super_admin()

  or (
    public.current_role() = 'college_admin'
    and college_id = public.current_college_id()
  )
)
with check (
  public.is_super_admin()

  or (
    public.current_role() = 'college_admin'
    and college_id = public.current_college_id()
  )
);

-- =====================================================
-- FEE STRUCTURES POLICIES
-- =====================================================

create policy "college scoped fee structures"
on public.fee_structures
for select
using (
  public.is_super_admin()

  or college_id = public.current_college_id()
);

create policy "college admin manage fee structures"
on public.fee_structures
for all
using (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
)
with check (
  public.current_role() = 'college_admin'
  and college_id = public.current_college_id()
);