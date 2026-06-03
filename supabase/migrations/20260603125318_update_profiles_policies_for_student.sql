-- Since the API only updates avatar, students cannot change role/college/department even though they have update permission on their row.
-- whitelist fields explicitly. Like update({ avatar: filePath}), update({ full_name: data.full_name,}) etc

create policy "users update own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);