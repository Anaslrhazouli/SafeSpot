-- ============================================================
-- SafeSpot Student — Storage policies for spot photos
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create bucket if it does not exist
insert into storage.buckets (id, name, public)
values ('spot-photos', 'spot-photos', true)
on conflict (id) do nothing;

-- NOTE:
-- storage.objects is managed by Supabase and already has RLS enabled.
-- Do not run ALTER TABLE here because SQL Editor roles are not table owners
-- and will fail with: "must be owner of table objects".

-- Clean up existing policies if they already exist
-- (safe to re-run this migration)
drop policy if exists "Spot photos public read" on storage.objects;
drop policy if exists "Spot photos insert own folder" on storage.objects;
drop policy if exists "Spot photos update own folder" on storage.objects;
drop policy if exists "Spot photos delete own folder" on storage.objects;

-- Public read access for files in the spot-photos bucket
create policy "Spot photos public read"
on storage.objects
for select
to public
using (bucket_id = 'spot-photos');

-- Authenticated users can upload only to folder: {auth.uid()}/{spotId}/file.jpg
create policy "Spot photos insert own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'spot-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can update only their own folder files
create policy "Spot photos update own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'spot-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'spot-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can delete only their own folder files
create policy "Spot photos delete own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'spot-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
