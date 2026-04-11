-- ============================================================
-- Fix: handle_new_user trigger missing SET search_path
--
-- Without SET search_path = public, Postgres can't reliably
-- resolve the `profiles` table from inside a SECURITY DEFINER
-- function, causing "Database error saving new user" on sign-up.
--
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
