CREATE POLICY "users can upload own profile avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile_avatar'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "users can update own profile avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile_avatar'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "users can delete own profile avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile_avatar'
  AND auth.uid()::text = (storage.foldername(name))[1]
);