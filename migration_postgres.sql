-- ====================================================================
-- Database Migration: Transitioning from Legacy Firebase to PostgreSQL
-- Target: PressHouse Application Database
-- Date: June 2026
-- ====================================================================

-- 1. Create User Profiles Table (Transition from Firebase Auth & Firestore Users)
CREATE TABLE IF NOT EXISTS users (
  uid VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  "displayName" VARCHAR(255),
  "photoURL" TEXT,
  role VARCHAR(100) NOT NULL DEFAULT 'user',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for speedy email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Create Content Table (Transition from Firestore Articles Collection)
CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(255) PRIMARY KEY,
  title JSONB NOT NULL,
  content JSONB NOT NULL,
  category VARCHAR(100) NOT NULL,
  "authorId" VARCHAR(255),
  status VARCHAR(100) NOT NULL,
  language VARCHAR(100) NOT NULL,
  "mainImage" TEXT,
  show_in_slider BOOLEAN DEFAULT FALSE,
  slider_caption JSONB,
  slider_button_text JSONB,
  slider_image TEXT,
  seo JSONB,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for filtering published articles by language and category
CREATE INDEX IF NOT EXISTS idx_articles_status_lang ON articles(status, language);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- 3. Create YemenJPT Beta Registration Interest Records
CREATE TABLE IF NOT EXISTS yemenjpt_beta_registrations (
  id VARCHAR(255) PRIMARY KEY,
  "fullName" VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  organization VARCHAR(255),
  specialization VARCHAR(255),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for checking duplicate registrations by email
CREATE INDEX IF NOT EXISTS idx_beta_registrations_email ON yemenjpt_beta_registrations(email);
