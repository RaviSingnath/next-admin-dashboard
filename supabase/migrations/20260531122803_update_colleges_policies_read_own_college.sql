create policy "read own college"
on public.colleges
for select
using (
  public.is_super_admin()
  or id = public.current_college_id()
);