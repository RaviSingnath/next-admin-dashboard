DROP POLICY IF EXISTS "super_admin_can_insert_colleges" ON "colleges";
DROP POLICY IF EXISTS "super_admin_can_select_colleges" ON "colleges";
DROP POLICY IF EXISTS "super_admin_can_update_colleges" ON "colleges";
DROP POLICY IF EXISTS "super_admin_can_delete_colleges" ON "colleges";


create policy "super_admin_full_access_colleges"
on public.colleges
for all
using (
  public.is_super_admin()
)
with check (
  public.is_super_admin()
);