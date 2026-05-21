-- created_user_id Tracks actual auth account created
-- Useful for: auth debugging, account recovery, audit logs

-- accepted_by Tracks application profile.
-- Useful for: app-level queries, joins, dashboards

ALTER TABLE public.invitations
ADD COLUMN IF NOT EXISTS accepted_by uuid
REFERENCES public.profiles(id)
ON DELETE SET NULL;

ALTER TABLE public.invitations
ADD COLUMN IF NOT EXISTS created_user_id uuid
REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Removed column is_active. Now we have column status
ALTER TABLE public.profiles 
DROP COLUMN is_active;