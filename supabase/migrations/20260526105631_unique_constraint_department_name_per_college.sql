create unique index unique_department_per_college
on public.departments (
  college_id,
  lower(department_name)
);