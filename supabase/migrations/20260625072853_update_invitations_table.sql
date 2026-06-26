-- New invitation status
ALTER TYPE public.invitation_status ADD VALUE IF NOT EXISTS 'revoked';