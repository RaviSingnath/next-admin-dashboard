-- Helper since we'll likely reuse this pattern
-- for college_branding, college_documents, etc. later
create or replace function auth_college_id()
returns uuid
language sql
security definer
stable
as $$
  select college_id from public.profiles where id = auth.uid()
$$;

create or replace function auth_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- INSERT
create policy "college admins can upload own college logo"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'college_logo'
  and auth_role() = 'college_admin'
  and (storage.foldername(name))[1] = auth_college_id()::text
);

-- UPDATE
create policy "college admins can update own college logo"
on storage.objects for update
to authenticated
using (
  bucket_id = 'college_logo'
  and auth_role() = 'college_admin'
  and (storage.foldername(name))[1] = auth_college_id()::text
);

-- DELETE
create policy "college admins can delete own college logo"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'college_logo'
  and auth_role() = 'college_admin'
  and (storage.foldername(name))[1] = auth_college_id()::text
);

-- SELECT
create policy "authenticated users can view college logos"
on storage.objects for select
to authenticated
using (bucket_id = 'college_logo');