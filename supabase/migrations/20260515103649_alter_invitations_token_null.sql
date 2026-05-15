-- Make column NOT NULL
alter table public.invitations
alter column token
DROP NOT NULL;