create policy "authenticated users can view profile avatars"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile_avatar'
);