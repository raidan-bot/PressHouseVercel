-- Supabase Migrations File for Media Center Expansion
-- Created: 2026-06-13
-- Targets tables: success_stories, human_interest_stories, documentaries, press_releases, research_reports, social_media_campaigns

-- 1. Create Success Stories Table
CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL, -- { "ar": "...", "en": "..." }
    slug TEXT UNIQUE NOT NULL,
    hero_image TEXT,
    beneficiary_name TEXT,
    location TEXT,
    project_name TEXT,
    before_situation JSONB, -- { "ar": "...", "en": "..." }
    intervention JSONB, -- { "ar": "...", "en": "..." }
    outcome JSONB, -- { "ar": "...", "en": "..." }
    impact_metrics JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { "labelAr": "...", "labelEn": "...", "value": "..." }
    quote_block JSONB, -- { "textAr": "...", "textEn": "...", "authorAr": "...", "authorEn": "..." }
    gallery TEXT[] NOT NULL DEFAULT '{}'::text[],
    related_projects TEXT,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Human Interest Stories Table
CREATE TABLE IF NOT EXISTS public.human_interest_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    hero_image TEXT,
    subheadline JSONB, -- { "ar": "...", "en": "..." }
    story_body JSONB NOT NULL, -- { "ar": "...", "en": "..." }
    beneficiary_profile JSONB, -- { "ar": "...", "en": "..." }
    location TEXT,
    gallery TEXT[] NOT NULL DEFAULT '{}'::text[],
    audio_testimony TEXT,
    video_testimony TEXT,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Documentaries Table
CREATE TABLE IF NOT EXISTS public.documentaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    synopsis JSONB, -- { "ar": "...", "en": "..." }
    trailer TEXT,
    full_video TEXT,
    director TEXT,
    producer TEXT,
    runtime TEXT,
    language TEXT NOT NULL DEFAULT 'العربية / English',
    awards JSONB, -- { "ar": "...", "en": "..." }
    gallery TEXT[] NOT NULL DEFAULT '{}'::text[],
    downloads JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { "label": "...", "url": "..." }
    type TEXT NOT NULL CHECK (type IN ('film', 'short', 'success_video', 'humanitarian_video', 'interview', 'podcast')),
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Press Releases Table
CREATE TABLE IF NOT EXISTS public.press_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    dateline JSONB, -- { "ar": "...", "en": "..." }
    summary JSONB, -- { "ar": "...", "en": "..." }
    body JSONB NOT NULL, -- { "ar": "...", "en": "..." }
    media_contacts JSONB, -- { "ar": "...", "en": "..." }
    downloads JSONB NOT NULL DEFAULT '[]'::jsonb,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Research Reports Table
CREATE TABLE IF NOT EXISTS public.research_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    abstract JSONB NOT NULL, -- { "ar": "...", "en": "..." }
    methodology JSONB, -- { "ar": "...", "en": "..." }
    findings JSONB, -- { "ar": "...", "en": "..." }
    recommendations JSONB, -- { "ar": "...", "en": "..." }
    downloads JSONB NOT NULL DEFAULT '[]'::jsonb,
    type TEXT NOT NULL CHECK (type IN ('research', 'investigative', 'assessment', 'monitoring', 'analysis')),
    evidence_timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    evidence_files JSONB NOT NULL DEFAULT '[]'::jsonb,
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Social Media Campaigns Table
CREATE TABLE IF NOT EXISTS public.social_media_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    platforms TEXT[] NOT NULL,
    content_calendar JSONB NOT NULL DEFAULT '[]'::jsonb,
    performance_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    assets JSONB NOT NULL DEFAULT '[]'::jsonb,
    cta JSONB,
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.human_interest_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_campaigns ENABLE ROW LEVEL SECURITY;

-- Select RLS Policies for Public
CREATE POLICY "Public read for published success_stories" ON public.success_stories FOR SELECT USING (status = 'published');
CREATE POLICY "Public read for published human_interest_stories" ON public.human_interest_stories FOR SELECT USING (status = 'published');
CREATE POLICY "Public read for published documentaries" ON public.documentaries FOR SELECT USING (status = 'published');
CREATE POLICY "Public read for published press_releases" ON public.press_releases FOR SELECT USING (status = 'published');
CREATE POLICY "Public read for published research_reports" ON public.research_reports FOR SELECT USING (status = 'published');
CREATE POLICY "Public read for published social_media_campaigns" ON public.social_media_campaigns FOR SELECT USING (status = 'published');

-- Admin/Staff management RLS Policies
CREATE POLICY "Admins manage success_stories" ON public.success_stories FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('root', 'admin', 'staff', 'journalist'))
);
CREATE POLICY "Admins manage human_interest_stories" ON public.human_interest_stories FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('root', 'admin', 'staff', 'journalist'))
);
CREATE POLICY "Admins manage documentaries" ON public.documentaries FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('root', 'admin', 'staff', 'journalist'))
);
CREATE POLICY "Admins manage press_releases" ON public.press_releases FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('root', 'admin', 'staff', 'journalist'))
);
CREATE POLICY "Admins manage research_reports" ON public.research_reports FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('root', 'admin', 'staff', 'journalist'))
);
CREATE POLICY "Admins manage social_media_campaigns" ON public.social_media_campaigns FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('root', 'admin', 'staff', 'journalist'))
);
