CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  invited_role public.user_role;
  invited_college_id uuid;
  invited_department_id uuid;
  invitation_id uuid;
BEGIN

  -- ===================================================
  -- FIND LATEST VALID INVITATION
  -- ===================================================

  SELECT
    id,
    role,
    college_id,
    department_id
  INTO
    invitation_id,
    invited_role,
    invited_college_id,
    invited_department_id
  FROM public.invitations
  WHERE email = NEW.email
    AND status = 'pending'
    AND expires_at > pg_catalog.now()
  ORDER BY created_at DESC
  LIMIT 1;

  -- ===================================================
  -- NO VALID INVITATION FOUND
  -- ===================================================

  IF invitation_id IS NULL THEN
    RAISE EXCEPTION
      'No valid invitation found for email: %',
      NEW.email;
  END IF;

  -- ===================================================
  -- CREATE PROFILE
  -- ===================================================

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    college_id,
    department_id,
    status,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      ''
    ),
    invited_role,
    invited_college_id,
    invited_department_id,
    'inactive',
    pg_catalog.now(),
    pg_catalog.now()
  );

  -- ===================================================
  -- LINK INVITATION TO CREATED USER
  -- DO NOT MARK AS ACCEPTED YET
  -- ===================================================

  UPDATE public.invitations
  SET
    status = 'onboarding',
    created_user_id = NEW.id,
    updated_at = pg_catalog.now()
  WHERE id = invitation_id;

  RETURN NEW;
END;
$$;

ALTER TYPE public.invitation_status
ADD VALUE IF NOT EXISTS 'onboarding';