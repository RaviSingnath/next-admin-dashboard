-- =====================================================
-- ENABLE RLS
-- =====================================================

alter table public.colleges enable row level security;
alter table public.departments enable row level security;
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.invitations enable row level security;
alter table public.payments enable row level security;
alter table public.fee_structures enable row level security;
alter table public.audit_logs enable row level security;