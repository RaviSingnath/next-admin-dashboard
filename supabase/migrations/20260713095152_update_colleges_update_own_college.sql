create policy "college admin update own college"
on public.colleges
for update
using (
  public.current_role() = 'college_admin'
  and id = public.current_college_id()
)
with check (
  public.current_role() = 'college_admin'
  and id = public.current_college_id()
);