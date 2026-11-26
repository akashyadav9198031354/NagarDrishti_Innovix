CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  safe_display_name text;
BEGIN
  safe_display_name := COALESCE(
    nullif(left(btrim(new.raw_user_meta_data->>'display_name'), 80), ''),
    nullif(left(btrim(new.raw_user_meta_data->>'full_name'), 80), ''),
    nullif(left(btrim(split_part(COALESCE(new.email, ''), '@', 1)), 80), ''),
    'Citizen'
  );
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, safe_display_name);
  RETURN new;
END;
$$;
REVOKE ALL ON FUNCTION public.create_profile_for_new_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_profile_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_new_user();