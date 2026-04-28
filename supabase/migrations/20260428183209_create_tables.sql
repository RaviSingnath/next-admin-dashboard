-- =====================================================
-- TABLE: colleges
-- =====================================================

create table public.colleges (
  id uuid primary key default gen_random_uuid(),
  college_name text not null,
  official_email text unique not null,
  address text,
  phone text,
  logo_url text,
  stripe_connected_account_id text,
  status text default 'active',
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- =====================================================
-- TABLE: departments
-- =====================================================

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete restrict,
  department_name text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- =====================================================
-- TABLE: profiles
-- =====================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  role public.user_role not null,
  college_id uuid references public.colleges(id) on delete restrict,
  department_id uuid references public.departments(id) on delete restrict,
  created_by uuid references auth.users(id),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- =====================================================
-- TABLE: fee_structures
-- =====================================================

create table public.fee_structures (
  id uuid primary key default gen_random_uuid(),
  college_id uuid not null references public.colleges(id) on delete restrict,
  department_id uuid references public.departments(id) on delete restrict,
  course text,
  year text,
  total_fee numeric(12,2) not null,
  due_dates jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- TABLE: students
-- =====================================================

create table public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique not null references public.profiles(id) on delete cascade,
  college_id uuid not null references public.colleges(id) on delete restrict,
  department_id uuid references public.departments(id) on delete restrict,
  supervisor_id uuid references public.profiles(id) on delete restrict,
  created_by uuid references auth.users(id),
  admission_number text unique,
  course text,
  year text,
  fee_structure_id uuid references public.fee_structures(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- =====================================================
-- TABLE: invitations
-- =====================================================

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.user_role not null,
  college_id uuid references public.colleges(id) on delete cascade,
  department_id uuid references public.departments(id) on delete set null,
  invited_by uuid references auth.users(id),
  token text unique not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  status public.invitation_status default 'pending',
  created_at timestamptz default now()
);

-- =====================================================
-- TABLE: payments
-- =====================================================

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete restrict,
  college_id uuid not null references public.colleges(id) on delete restrict,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  amount numeric(12,2) not null,
  currency text default 'inr',
  status public.payment_status default 'pending',
  payment_type text,
  paid_at timestamptz,
  created_at timestamptz default now()
);

-- =====================================================
-- TABLE: audit_logs
-- =====================================================

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action_type text not null,
  table_name text not null,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  created_at timestamptz default now()
);