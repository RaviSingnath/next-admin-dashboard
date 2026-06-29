-- ─────────────────────────────────────────────────────────────────────────────
-- Add soft delete columns to invitations
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.invitations
  ADD COLUMN deleted_at  TIMESTAMPTZ,
  ADD COLUMN deleted_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.invitations
  ADD CONSTRAINT invitation_delete_rules CHECK (
    (deleted_at IS NULL  AND deleted_by IS NULL)
    OR
    (deleted_at IS NOT NULL AND deleted_by IS NOT NULL)
  );

CREATE INDEX idx_invitations_not_deleted
  ON public.invitations (id)
  WHERE deleted_at IS NULL;