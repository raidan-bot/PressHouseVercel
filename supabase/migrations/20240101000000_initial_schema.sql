-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  uid text UNIQUE,
  email text UNIQUE NOT NULL,
  displayName text,
  photoURL text,
  role text DEFAULT 'member',
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for published users" ON public.users
  FOR SELECT USING (true); -- Adjust as needed in production

CREATE POLICY "Users can edit their own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = uid);

-- Create news table (assuming similar to existing SQLite)
CREATE TABLE IF NOT EXISTS public.news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  author_id text REFERENCES public.users(uid),
  published boolean DEFAULT false,
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

-- Enable RLS for news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published news" ON public.news
  FOR SELECT USING (published = true);

-- Create violations table
CREATE TABLE IF NOT EXISTS public.violations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending',
  reporter_id text,
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

-- Enable RLS for violations
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read their own violations" ON public.violations
  FOR SELECT USING (auth.uid()::text = reporter_id);

-- Create academy_courses table instead of academy generic
CREATE TABLE IF NOT EXISTS public.academy_courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  instructor_id text REFERENCES public.users(uid),
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

-- Enable RLS for academy
ALTER TABLE public.academy_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read academy courses" ON public.academy_courses
  FOR SELECT USING (true);
