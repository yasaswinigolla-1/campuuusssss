/*
# CampusFind — Campus Lost & Found Management System

## Overview
Creates the complete database schema for CampusFind, a platform where students
report lost/found items, search for matches, submit claims, verify ownership,
and return items to their rightful owners.

## New Tables
1. `profiles` — extends Supabase auth.users with username and full_name.
   - id (uuid, PK, FK to auth.users)
   - username (text, unique, not null)
   - full_name (text)
   - created_at (timestamptz)

2. `lost_items` — items reported as lost by students.
   - id, user_id, item_name, category, description, location,
     date_lost, approx_time, image_url, additional_info, status, created_at
   - status: active | found | returned

3. `found_items` — items reported as found by students.
   - id, user_id, item_name, category, description, location,
     date_found, approx_time, image_url, additional_info, status, created_at
   - status: available | claimed | returned

4. `claims` — claim requests submitted on found items.
   - id, found_item_id (FK), claimant_id (FK), finder_id (FK),
     claim_message, verification_info, status, created_at, updated_at
   - status: pending | approved | rejected | returned

5. `notifications` — in-app notifications for users.
   - id, user_id, message, type, is_read, created_at

## Security (RLS)
- profiles: all authenticated users can read; users can update only their own.
- lost_items: all authenticated users can read; owners can insert/update/delete their own.
- found_items: all authenticated users can read; owners can insert/update/delete their own.
- claims: claimant and finder can read; claimant can insert; finder can update status.
- notifications: users can read/update/delete only their own.
- Storage bucket `item-images`: authenticated can upload; public can read.

## Triggers
- Auto-create profile on auth.users insert.
- Auto-update claims.updated_at on row update.
*/

-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- =========================================================
-- LOST ITEMS
-- =========================================================
CREATE TABLE IF NOT EXISTS lost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text NOT NULL,
  description text,
  location text,
  date_lost date,
  approx_time text,
  image_url text,
  additional_info text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lost_items_select_all" ON lost_items;
CREATE POLICY "lost_items_select_all" ON lost_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "lost_items_insert_own" ON lost_items;
CREATE POLICY "lost_items_insert_own" ON lost_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lost_items_update_own" ON lost_items;
CREATE POLICY "lost_items_update_own" ON lost_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lost_items_delete_own" ON lost_items;
CREATE POLICY "lost_items_delete_own" ON lost_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- FOUND ITEMS
-- =========================================================
CREATE TABLE IF NOT EXISTS found_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  category text NOT NULL,
  description text,
  location text,
  date_found date,
  approx_time text,
  image_url text,
  additional_info text,
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE found_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "found_items_select_all" ON found_items;
CREATE POLICY "found_items_select_all" ON found_items
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "found_items_insert_own" ON found_items;
CREATE POLICY "found_items_insert_own" ON found_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "found_items_update_own" ON found_items;
CREATE POLICY "found_items_update_own" ON found_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "found_items_delete_own" ON found_items;
CREATE POLICY "found_items_delete_own" ON found_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- CLAIMS
-- =========================================================
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  found_item_id uuid NOT NULL REFERENCES found_items(id) ON DELETE CASCADE,
  claimant_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  finder_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_message text,
  verification_info text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Claimant and finder can both read the claim
DROP POLICY IF EXISTS "claims_select_parties" ON claims;
CREATE POLICY "claims_select_parties" ON claims
  FOR SELECT TO authenticated
  USING (auth.uid() = claimant_id OR auth.uid() = finder_id);

-- Only authenticated users can insert claims for themselves (must not be the finder)
DROP POLICY IF EXISTS "claims_insert_own" ON claims;
CREATE POLICY "claims_insert_own" ON claims
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = claimant_id AND auth.uid() != finder_id);

-- Only the finder can update the claim status
DROP POLICY IF EXISTS "claims_update_finder" ON claims;
CREATE POLICY "claims_update_finder" ON claims
  FOR UPDATE TO authenticated
  USING (auth.uid() = finder_id)
  WITH CHECK (auth.uid() = finder_id);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_own" ON notifications;
CREATE POLICY "notifications_insert_own" ON notifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_delete_own" ON notifications;
CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- INDEXES
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_lost_items_user_id ON lost_items(user_id);
CREATE INDEX IF NOT EXISTS idx_lost_items_category ON lost_items(category);
CREATE INDEX IF NOT EXISTS idx_lost_items_status ON lost_items(status);
CREATE INDEX IF NOT EXISTS idx_found_items_user_id ON found_items(user_id);
CREATE INDEX IF NOT EXISTS idx_found_items_category ON found_items(category);
CREATE INDEX IF NOT EXISTS idx_found_items_status ON found_items(status);
CREATE INDEX IF NOT EXISTS idx_claims_found_item_id ON claims(found_item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant_id ON claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_claims_finder_id ON claims(finder_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- =========================================================
-- TRIGGERS
-- =========================================================

-- Auto-create profile when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update claims.updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS claims_update_timestamp ON claims;
CREATE TRIGGER claims_update_timestamp
  BEFORE UPDATE ON claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =========================================================
-- STORAGE BUCKET
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT DO NOTHING;

-- Storage policies: authenticated can upload, public can read
DROP POLICY IF EXISTS "item_images_read_public" ON storage.objects;
CREATE POLICY "item_images_read_public" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'item-images');

DROP POLICY IF EXISTS "item_images_upload_auth" ON storage.objects;
CREATE POLICY "item_images_upload_auth" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'item-images');

DROP POLICY IF EXISTS "item_images_update_own" ON storage.objects;
CREATE POLICY "item_images_update_own" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'item-images' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'item-images');

DROP POLICY IF EXISTS "item_images_delete_own" ON storage.objects;
CREATE POLICY "item_images_delete_own" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'item-images' AND auth.uid() = owner);
