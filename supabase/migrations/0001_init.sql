-- ============================================================
-- SafeSpot Student — Database Migration
-- Run this in Supabase SQL Editor or via Supabase CLI
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Profiles table (auto-created on auth.users insert)
-- ──────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  display_name text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

-- Trigger to auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- ──────────────────────────────────────────────────────────────
-- 2. Spots table
-- ──────────────────────────────────────────────────────────────

create table if not exists public.spots (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  title            text not null,
  category         text not null,
  description      text,
  address          text,
  latitude         double precision,
  longitude        double precision,
  rating           integer default 0 check (rating >= 0 and rating <= 5),
  is_favorite      boolean default false,
  is_safe_at_night boolean default false,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index if not exists idx_spots_user_id on public.spots(user_id);
create index if not exists idx_spots_category on public.spots(category);

alter table public.spots enable row level security;

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists spots_updated_at on public.spots;
create trigger spots_updated_at
  before update on public.spots
  for each row execute function public.update_updated_at();

-- RLS: users can only CRUD their own spots
create policy "Users can view own spots"
  on public.spots for select
  using (auth.uid() = user_id);

create policy "Users can insert own spots"
  on public.spots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own spots"
  on public.spots for update
  using (auth.uid() = user_id);

create policy "Users can delete own spots"
  on public.spots for delete
  using (auth.uid() = user_id);


-- ──────────────────────────────────────────────────────────────
-- 3. Spot Tags table
-- ──────────────────────────────────────────────────────────────

create table if not exists public.spot_tags (
  id       uuid primary key default gen_random_uuid(),
  spot_id  uuid not null references public.spots(id) on delete cascade,
  label    text not null
);

create index if not exists idx_spot_tags_spot_id on public.spot_tags(spot_id);

alter table public.spot_tags enable row level security;

-- RLS: users can manage tags on their own spots
create policy "Users can view tags of own spots"
  on public.spot_tags for select
  using (
    exists (
      select 1 from public.spots
      where spots.id = spot_tags.spot_id
        and spots.user_id = auth.uid()
    )
  );

create policy "Users can insert tags on own spots"
  on public.spot_tags for insert
  with check (
    exists (
      select 1 from public.spots
      where spots.id = spot_tags.spot_id
        and spots.user_id = auth.uid()
    )
  );

create policy "Users can delete tags of own spots"
  on public.spot_tags for delete
  using (
    exists (
      select 1 from public.spots
      where spots.id = spot_tags.spot_id
        and spots.user_id = auth.uid()
    )
  );


-- ──────────────────────────────────────────────────────────────
-- 4. Spot Photos table
-- ──────────────────────────────────────────────────────────────

create table if not exists public.spot_photos (
  id         uuid primary key default gen_random_uuid(),
  spot_id    uuid not null references public.spots(id) on delete cascade,
  image_url  text not null,
  created_at timestamptz default now()
);

create index if not exists idx_spot_photos_spot_id on public.spot_photos(spot_id);

alter table public.spot_photos enable row level security;

-- RLS: users can manage photos of their own spots
create policy "Users can view photos of own spots"
  on public.spot_photos for select
  using (
    exists (
      select 1 from public.spots
      where spots.id = spot_photos.spot_id
        and spots.user_id = auth.uid()
    )
  );

create policy "Users can insert photos on own spots"
  on public.spot_photos for insert
  with check (
    exists (
      select 1 from public.spots
      where spots.id = spot_photos.spot_id
        and spots.user_id = auth.uid()
    )
  );

create policy "Users can delete photos of own spots"
  on public.spot_photos for delete
  using (
    exists (
      select 1 from public.spots
      where spots.id = spot_photos.spot_id
        and spots.user_id = auth.uid()
    )
  );


-- ──────────────────────────────────────────────────────────────
-- 5. Storage bucket for spot photos
-- ──────────────────────────────────────────────────────────────
-- NOTE: Run this separately in the Supabase dashboard:
--
--   1. Go to Storage → New Bucket
--   2. Name: "spot-photos"
--   3. Public bucket: ON (so images are accessible via public URL)
--
-- Then add these storage policies via SQL or dashboard:

-- Allow authenticated users to upload to their folder
-- Policy name: "Users can upload to own folder"
-- Operation: INSERT
-- Target: spot-photos bucket
-- Policy: (bucket_id = 'spot-photos') AND (auth.uid()::text = (storage.foldername(name))[1])

-- Allow anyone to read (since bucket is public)
-- Policy name: "Public read access"
-- Operation: SELECT
-- Target: spot-photos bucket
-- Policy: bucket_id = 'spot-photos'

-- Allow users to delete their own files
-- Policy name: "Users can delete own files"
-- Operation: DELETE
-- Target: spot-photos bucket
-- Policy: (bucket_id = 'spot-photos') AND (auth.uid()::text = (storage.foldername(name))[1])
