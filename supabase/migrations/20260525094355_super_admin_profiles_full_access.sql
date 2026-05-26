create policy "super admin full access profiles"
on public.profiles
for all
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);