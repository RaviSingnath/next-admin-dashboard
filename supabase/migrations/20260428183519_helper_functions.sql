-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

create or replace function public.current_role()
returns public.user_role
language sql
stable
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.current_college_id()
returns uuid
language sql
stable
as $$
  select college_id
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select public.current_role() = 'super_admin';
$$;