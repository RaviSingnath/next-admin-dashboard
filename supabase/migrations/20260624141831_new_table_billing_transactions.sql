ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'processing';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'succeeded';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'failed';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'refunded';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'partially_refunded';
ALTER TYPE public.payment_status ADD VALUE IF NOT EXISTS 'disputed';

-- =====================================================
-- Billing transactions table
-- =====================================================

create table public.billing_transactions (
  id uuid primary key default gen_random_uuid(),

  college_id uuid not null
    references public.colleges(id)
    on delete restrict,

  student_id uuid
    references public.students(id)
    on delete restrict,

  parent_transaction_id uuid
    references public.billing_transactions(id)
    on delete restrict,

  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  stripe_charge_id text,
  stripe_invoice_id text,
  stripe_subscription_id text,
  stripe_refund_id text,
  stripe_customer_id text,

  stripe_connected_account_id text,
  stripe_transfer_id text,

  invoice_number text,
  invoice_pdf_url text,

  amount numeric(12,2) not null,
  amount_minor bigint not null,

  application_fee_amount_minor bigint,

  currency text not null default 'inr',

  status public.payment_status not null default 'pending',

  transaction_action text not null,
  source_type text not null,

  failure_reason text,

  paid_at timestamptz,
  refunded_at timestamptz,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint billing_transactions_amount_check
    check (amount >= 0),
  constraint billing_transactions_amount_minor_check
    check (amount_minor >= 0),
  constraint billing_transactions_application_fee_check
    check (
      application_fee_amount_minor is null
      or application_fee_amount_minor >= 0
    ),
  constraint billing_transactions_currency_check
    check (currency = lower(currency) and length(currency) = 3),
  constraint billing_transactions_action_check
    check (
      transaction_action in (
        'charge',
        'refund',
        'credit',
        'adjustment'
      )
    ),

    constraint billing_transactions_source_check
    check (
      source_type in (
        'subscription',
        'student_fee',
        'manual'
      )
    ),
  constraint billing_transactions_student_fee_check
    check (
      source_type <> 'student_fee'
      or student_id is not null
    ),

    -- A refund must always trace back to its original charge
constraint billing_transactions_refund_parent_check
  check (
    transaction_action <> 'refund'
    or parent_transaction_id is not null
  ),

-- A subscription transaction must always carry its Stripe subscription ID
constraint billing_transactions_subscription_id_check
  check (
    source_type <> 'subscription'
    or stripe_subscription_id is not null
  )

);

alter table public.billing_transactions enable row level security;

create policy "college scoped billing transactions"
on public.billing_transactions
for select
using (
  public.is_super_admin()
  or college_id = public.current_college_id()
);

create policy "student own billing transactions"
on public.billing_transactions
for select
using (
  exists (
    select 1
    from public.students s
    where s.id = student_id
      and s.profile_id = auth.uid()
  )
);

create policy "college admin insert student fee transactions"
on public.billing_transactions
for insert
with check (
  public.current_user_role() = 'college_admin'
  and college_id = public.current_college_id()
  and source_type = 'student_fee'
  and student_id is not null
  and transaction_action = 'charge'
);

create policy "super admin manage billing transactions"
on public.billing_transactions
for all
using (public.is_super_admin())
with check (public.is_super_admin());

create unique index billing_transactions_stripe_checkout_session_id_key
on public.billing_transactions (stripe_checkout_session_id)
where stripe_checkout_session_id is not null;

create unique index billing_transactions_stripe_payment_intent_id_key
on public.billing_transactions (stripe_payment_intent_id)
where stripe_payment_intent_id is not null;

create unique index billing_transactions_stripe_invoice_id_key
on public.billing_transactions (stripe_invoice_id)
where stripe_invoice_id is not null;

create unique index billing_transactions_stripe_refund_id_key
on public.billing_transactions (stripe_refund_id)
where stripe_refund_id is not null;

create unique index billing_transactions_stripe_charge_id_key
on public.billing_transactions (stripe_charge_id)
where stripe_charge_id is not null;

create index billing_transactions_college_id_idx
on public.billing_transactions (college_id);

create index billing_transactions_student_id_idx
on public.billing_transactions (student_id)
where student_id is not null;

create index billing_transactions_status_idx
on public.billing_transactions (status);

create index billing_transactions_created_at_idx
on public.billing_transactions(created_at desc);

create index billing_transactions_parent_transaction_id_idx
on public.billing_transactions(parent_transaction_id)
where parent_transaction_id is not null;

create unique index billing_transactions_invoice_number_key
on public.billing_transactions(invoice_number)
where invoice_number is not null;

create index billing_transactions_stripe_subscription_id_idx
on public.billing_transactions(stripe_subscription_id)
where stripe_subscription_id is not null;

create trigger set_billing_transactions_updated_at
before update on public.billing_transactions
for each row
execute function public.set_updated_at();