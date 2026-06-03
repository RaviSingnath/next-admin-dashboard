-- avatars are stored per user folder. Like avatars/user-id/avatar.webp
create policy "users read own avatars"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile_avatar'
  and auth.uid()::text = (storage.foldername(name))[1]
);