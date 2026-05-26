drop index if exists unique_department_per_college;

create unique index unique_active_department_per_college
on public.departments (
  college_id,
  lower(department_name)
)
where deleted_at is null;