-- =====================================================
-- 1. UPDATED_AT TRIGGER FUNCTION
-- =====================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================
-- APPLY updated_at TRIGGERS
-- =====================================================

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_colleges_updated_at
before update on public.colleges
for each row
execute function public.set_updated_at();

create trigger set_departments_updated_at
before update on public.departments
for each row
execute function public.set_updated_at();

create trigger set_students_updated_at
before update on public.students
for each row
execute function public.set_updated_at();

create trigger set_fee_structures_updated_at
before update on public.fee_structures
for each row
execute function public.set_updated_at();

-- =====================================================
-- 2. AUDIT LOG FUNCTION
-- =====================================================

create or replace function public.create_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_logs (
    actor_id,
    action_type,
    table_name,
    record_id,
    old_data,
    new_data,
    created_at
  )
  values (
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    to_jsonb(old),
    to_jsonb(new),
    now()
  );

  return coalesce(new, old);
end;
$$;

-- =====================================================
-- APPLY AUDIT LOG TRIGGERS
-- =====================================================

create trigger audit_students
after insert or update or delete
on public.students
for each row
execute function public.create_audit_log();

create trigger audit_payments
after insert or update or delete
on public.payments
for each row
execute function public.create_audit_log();

create trigger audit_profiles
after insert or update or delete
on public.profiles
for each row
execute function public.create_audit_log();

create trigger audit_departments
after insert or update or delete
on public.departments
for each row
execute function public.create_audit_log();

create trigger audit_invitations
after insert or update or delete
on public.invitations
for each row
execute function public.create_audit_log();