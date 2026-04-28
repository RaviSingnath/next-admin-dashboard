-- =====================================================
-- College Dairy RBAC Migration
-- Part 1: Extensions + Enums
-- =====================================================

create extension if not exists pgcrypto;

-- =====================================================
-- ENUMS
-- =====================================================

create type public.user_role as enum (
  'super_admin',
  'college_admin',
  'supervisor',
  'student'
);

create type public.invitation_status as enum (
  'pending',
  'accepted',
  'expired',
  'cancelled'
);

create type public.payment_status as enum (
  'pending',
  'paid',
  'failed',
  'refunded'
);