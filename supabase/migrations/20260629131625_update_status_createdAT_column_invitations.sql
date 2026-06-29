ALTER TABLE public.invitations
ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE public.invitations
ALTER COLUMN status SET NOT NULL;


ALTER TABLE public.invitations
ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE public.invitations
ALTER COLUMN created_at SET NOT NULL;