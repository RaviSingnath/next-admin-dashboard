-- Set default auth.uid()
alter table public.colleges
alter column created_by
set default auth.uid();

-- Make column NOT NULL
alter table public.colleges
alter column created_by
set not null;