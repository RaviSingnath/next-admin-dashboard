-- =====================================================
-- Migration: User Lifecycle Management via public.profiles
-- =====================================================

-- =====================================================
-- CREATE USER STATUS ENUM
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'user_status'
  ) THEN
    CREATE TYPE public.user_status AS ENUM (
      'active',
      'inactive',
      'suspended',
      'deleted'
    );
  END IF;
END
$$;

-- =====================================================
-- ADD PROFILE LIFECYCLE COLUMNS
-- =====================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status public.user_status
NOT NULL DEFAULT 'inactive';

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- =====================================================
-- OPTIONAL BACKFILL
-- Existing rows become active
-- =====================================================

UPDATE public.profiles
SET status = 'active'
WHERE status = 'inactive';

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_status
ON public.profiles(status);

CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at
ON public.profiles(deleted_at);

-- =====================================================
-- FUNCTION: SOFT DELETE USER
-- =====================================================

CREATE OR REPLACE FUNCTION public.soft_delete_profile(
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN

  UPDATE public.profiles
  SET
    status = 'deleted',
    deleted_at = pg_catalog.now(),
    updated_at = pg_catalog.now()
  WHERE id = p_user_id
    AND status != 'deleted';

END;
$$;

ALTER FUNCTION public.soft_delete_profile(uuid)
OWNER TO postgres;

-- =====================================================
-- FUNCTION: RESTORE USER
-- =====================================================

CREATE OR REPLACE FUNCTION public.restore_profile(
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN

  UPDATE public.profiles
  SET
    status = 'active',
    deleted_at = NULL,
    updated_at = pg_catalog.now()
  WHERE id = p_user_id
    AND status = 'deleted';

END;
$$;

ALTER FUNCTION public.restore_profile(uuid)
OWNER TO postgres;

-- =====================================================
-- FUNCTION: SUSPEND USER
-- =====================================================

CREATE OR REPLACE FUNCTION public.suspend_profile(
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN

  UPDATE public.profiles
  SET
    status = 'suspended',
    updated_at = pg_catalog.now()
  WHERE id = p_user_id
    AND status != 'deleted';

END;
$$;

ALTER FUNCTION public.suspend_profile(uuid)
OWNER TO postgres;

-- =====================================================
-- FUNCTION: ACTIVATE USER
-- =====================================================

CREATE OR REPLACE FUNCTION public.activate_profile(
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN

  UPDATE public.profiles
  SET
    status = 'active',
    updated_at = pg_catalog.now()
  WHERE id = p_user_id;

END;
$$;

ALTER FUNCTION public.activate_profile(uuid)
OWNER TO postgres;

-- =====================================================
-- FUNCTION: HARD DELETE USER PROFILE
-- =====================================================

CREATE OR REPLACE FUNCTION public.hard_delete_profile(
  p_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN

  DELETE FROM public.profiles
  WHERE id = p_user_id;

END;
$$;

ALTER FUNCTION public.hard_delete_profile(uuid)
OWNER TO postgres;