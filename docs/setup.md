# PressHouse Setup Guide

This guide provides step-by-step instructions for setting up the PressHouse project.

## 1. Prerequisites
- Node.js (v18+)
- npm
- PostgreSQL database instance (or SQLite for local development)

## 2. Environment Variables
1. Copy `.env.example` to `.env`.
2. Configure the required variables in `.env`:
   - `POSTGRES_URL`: Connection string to your PostgreSQL database.
   - `JWT_SECRET`: A secure, unique hash string.
   - `ADMIN_PASSWORD`: Default admin password.
   - `GEMINI_API_KEY`: API key for Gemini.

## 3. Database Setup & Migration
- **PostgreSQL**: 
  1. Ensure your PostgreSQL instance is running.
  2. The application automatically runs migrations on startup using `schema.sql`. Ensure `POSTGRES_URL` is configured.
- **SQLite**:
  1. If `POSTGRES_URL` is not provided, the application will use `database.sqlite` automatically.
  2. Ensure `schema.sql` is present in the root directory.

## 4. Storage Configuration
S3 storage credentials (Bucket, Region, Keys) are managed dynamically through the Admin Dashboard settings after initialization.

## 5. Installation & Launch
1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the development server:
   ```bash
   npm run dev
   ```
The application will start on port 3000.
