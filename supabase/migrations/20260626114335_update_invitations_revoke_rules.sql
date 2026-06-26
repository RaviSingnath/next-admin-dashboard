-- New columns for revoke featue
alter table public.invitations
  add column revoked_at timestamptz null,
  add column revoked_by uuid null,
  add column revoked_reason text null;

-- foreign key constraint for revoked_by
alter table public.invitations
  add constraint invitations_revoked_by_fkey
  foreign key (revoked_by)
  references profiles(id)
  on delete set null;

-- =====================================================
-- Constraint for revoke consistency like below
-- revoked status must have revoke metadata
-- non-revoked status should not have revoke metadata
-- =====================================================
alter table public.invitations
  add constraint invitation_revoke_rules check (
    (
      status = 'revoked'
      and revoked_at is not null
      and revoked_by is not null
    )
    or
    (
      status <> 'revoked'
    )
  );