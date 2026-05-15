-- Set default auth.uid()
alter table public.invitations
alter column invited_by
set default auth.uid();

-- Make column NOT NULL
alter table public.invitations
alter column invited_by
set not null;