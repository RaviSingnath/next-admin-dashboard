create policy "super_admin_can_insert_colleges"
on public.colleges
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and public.is_super_admin()
  )
);

create policy "super_admin_can_select_colleges"
on public.colleges
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and public.is_super_admin()
  )
);

create policy "super_admin_can_update_colleges"
on public.colleges
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and public.is_super_admin()
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and public.is_super_admin()
  )
);

create policy "super_admin_can_delete_colleges"
on public.colleges
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and public.is_super_admin()
  )
);