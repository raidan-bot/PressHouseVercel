-- Supabase Migrations File for PressHouse CMS
-- Created: 2026-06-13
-- Targets tables: users, news, violations, academy

-- Enable Row Level Security (RLS)
-- Define System Roles enum or constraints

-- 1. Create Users (Profiles) Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('root', 'admin', 'staff', 'journalist', 'user')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create News (Articles) Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL, -- Format: { "ar": "...", "en": "..." }
    content JSONB NOT NULL, -- Format: { "ar": "...", "en": "..." }
    category TEXT NOT NULL CHECK (category IN ('news', 'report', 'press_release')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    language TEXT NOT NULL DEFAULT 'both' CHECK (language IN ('ar', 'en', 'both')),
    main_image TEXT,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    show_in_slider BOOLEAN DEFAULT false,
    slider_caption JSONB,
    slider_button_text JSONB,
    slider_image TEXT,
    seo JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Violations Table
CREATE TABLE IF NOT EXISTS public.violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    victim_name TEXT NOT NULL,
    violation_date DATE NOT NULL,
    governorate TEXT NOT NULL,
    location TEXT,
    violation_type TEXT NOT NULL,
    description JSONB NOT NULL,
    perpetrator TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'archived')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    media_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Academy (Courses) Table
CREATE TABLE IF NOT EXISTS public.academy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    trainer JSONB,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'upcoming')),
    start_date DATE,
    duration_hours INTEGER,
    max_students INTEGER,
    registered_count INTEGER DEFAULT 0,
    syllabus JSONB,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Users Read Policy (Public or authenticated)
CREATE POLICY "Public users are readable by everyone" ON public.users
    FOR SELECT USING (true);

-- Users Write Policy (Only user profile owners can update, root/admins full access)
CREATE POLICY "Users can edit their own profiles" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- News Policy: read-all-published for public; root/admin/staff/journalist full management
CREATE POLICY "Published news are readable by everyone" ON public.news
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins/Journalists can manage all news" ON public.news
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('root', 'admin', 'staff', 'journalist')
        )
    );

-- Violations Policy: Public read-all-verified; full management for authorized users
CREATE POLICY "Verified violations are readable by everyone" ON public.violations
    FOR SELECT USING (status = 'verified');

CREATE POLICY "Admins/Staff can manage violations" ON public.violations
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('root', 'admin', 'staff')
        )
    );

-- Academy Policy: Public read-active/any; write allowed for admins
CREATE POLICY "Academy courses are readable by everyone" ON public.academy
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage academy courses" ON public.academy
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('root', 'admin', 'staff')
        )
    );
