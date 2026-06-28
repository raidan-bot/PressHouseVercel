# PressHouse CMS — Development Roadmap

> **Status**: Generated after comprehensive DISCOVERY phase (4 parallel agents)
> **Server**: 6,342 lines Express + 31 frontend pages + 55 DB tables

---

## ✅ Already Completed (DISCOVERY Phase)

| # | Item | Risk | Changed Files |
|---|---|---|---|
| 1 | Helmet security headers | 🔴 CRITICAL | `server.ts` |
| 2 | Rate limiting (auth: 20/15min, upload: 30/15min, contact: 10/15min) | 🔴 CRITICAL | `server.ts` |
| 3 | S3 hardcoded credentials removed from client code | 🔴 CRITICAL | `src/services/storage.ts` |
| 4 | `.env.example` sanitized (admin creds + JWT secret removed) | 🔴 CRITICAL | `.env.example` |
| 5 | AGENTS.md comprehensive backend analysis appended | 🟢 INFO | `AGENTS.md` |
| 6 | Package dependencies added (`helmet`, `express-rate-limit`) | 🟢 INFO | `package.json` |
| 7 | SidebarLayout.tsx icon cleanup | 🟢 LOW | `SidebarLayout.tsx` |

---

## 📋 ROADMAP — 5 Phases

```
Phase 1 🔴 SECURITY HARDENING ──────────────┐
                                             │
Phase 2 🟡 BACKEND MODULARIZATION ───────────┤
                                             │
Phase 3 🟢 FEATURE COMPLETENESS ─────────────┤
                                             │
Phase 4 🔵 DEVOPS & INFRASTRUCTURE ──────────┤
                                             │
Phase 5 🟣 AI & PLATFORM EVOLUTION ──────────┘
```

---

## PHASE 1 🔴 SECURITY HARDENING (HIGHEST PRIORITY)

### 1.1 Auth Middleware on Admin Endpoints
- **Issue**: ~40 POST/PUT/DELETE admin endpoints lack `authenticateToken` middleware
- **Scope**: All endpoints in `server.ts` for users, media, settings, sectors, programs, projects, hero slides, page content, menus, institution identity, subscribers, tenders, employees, board members, partners, departments, teams, tasks, custom lists, analytics, success stories, testimonials, facebook, developer tokens, newsletter, contacts
- **Action**: Add `authenticateToken` middleware array; add role-check middleware for admin-level operations
- **Effort**: ⏱️ 2-3 hours

### 1.2 JWT Security Upgrade
- **Issue**: JWT stored in `localStorage` (XSS-vulnerable), no refresh tokens, 24h expiry with no rotation
- **Actions**:
  - Migrate to httpOnly cookie-based JWT storage
  - Implement refresh token rotation (short-lived access + long-lived refresh)
  - Add CSRF token for state-changing requests
  - Add token revocation on password change
- **Effort**: ⏱️ 4-6 hours

### 1.3 Input Validation Library
- **Issue**: No zod/joi/express-validator — raw `req.body` used everywhere
- **Actions**:
  - Add `zod` dependency
  - Create validation schemas for all POST/PUT endpoints
  - Add middleware that validates before route handlers
  - Return structured validation error responses
- **Effort**: ⏱️ 6-8 hours

### 1.4 SQL Injection Hardening
- **Issue**: Template literals used in `ORDER BY ${sortOrder}` and similar dynamic SQL clauses
- **Actions**:
  - Audit all raw SQL queries in `server.ts` and `src/db.ts`
  - Replace dynamic ORDER BY with whitelist-based validation
  - Ensure all user input uses parameterized queries exclusively
  - Add query sanitization middleware
- **Effort**: ⏱️ 3-4 hours

### 1.5 File Upload Hardening
- **Issue**: No magic byte verification (only extension whitelist), `GET /api/s3/config` leaks credentials
- **Actions**:
  - Add magic byte/file signature verification to multer filter
  - Remove `GET /api/s3/config` endpoint (or restrict to admin-only)
  - Add file size limits in middleware (not just multer config)
  - Add upload virus scanning placeholder
- **Effort**: ⏱️ 2-3 hours

### 1.6 MCP Endpoint Hardening
- **Issue**: `POST /api/mcp/execute` allows arbitrary INSERT/UPDATE/DELETE
- **Actions**:
  - Add authentication + role verification to MCP endpoints
  - Implement operation whitelist (only allow specific table/operation combos)
  - Add audit logging for all MCP write operations
  - Rate limit MCP endpoints
- **Effort**: ⏱️ 2-3 hours

### 1.7 CSRF Protection
- **Issue**: No CSRF protection — cookie-based attacks possible
- **Actions**:
  - Add `csurf` or `csrf-csrf` middleware
  - Add CSRF tokens to all state-changing forms
  - Add CSRF token endpoint for SPA requests
- **Effort**: ⏱️ 2 hours

> **Total Phase 1 Effort**: ⏱️ ~21-28 hours — **🚨 DO NOT SHIP WITHOUT PHASE 1**

---

## PHASE 2 🟡 BACKEND MODULARIZATION

### 2.1 Server.ts Refactoring
- **Issue**: 6,342-line monolithic `server.ts` — impossible to maintain
- **Actions**:
  - Split into `src/routes/*.ts` modules by domain:
    - `auth.routes.ts`, `article.routes.ts`, `event.routes.ts`, `violation.routes.ts`
    - `media.routes.ts`, `academy.routes.ts`, `settings.routes.ts`
    - `analytics.routes.ts`, `ai.routes.ts`, `telegram.routes.ts`
    - `volunteer.routes.ts`, `tender.routes.ts`, `mcp.routes.ts`
  - Extract middleware to `src/middleware/`:
    - `auth.middleware.ts`, `validation.middleware.ts`, `upload.middleware.ts`, `rate-limit.middleware.ts`
  - Extract services to `src/services/`:
    - `email.service.ts`, `telegram.service.ts`, `blob.service.ts`
  - Keep `server.ts` as thin orchestration layer (~200 lines)
- **Effort**: ⏱️ 8-12 hours

### 2.2 Database Access Layer
- **Issue**: Raw SQL queries scattered across route handlers
- **Actions**:
  - Create `src/models/` or `src/repositories/` for each entity
  - Move all DB queries out of route handlers
  - Add proper TypeScript types for all DB operations
  - Consider migrating from raw SQL to Drizzle ORM (already a dependency)
- **Effort**: ⏱️ 6-10 hours

### 2.3 API Contract & Documentation
- **Actions**:
  - Add OpenAPI/Swagger docs for all endpoints
  - Create shared TypeScript types in `src/types/api.ts`
  - Add response DTOs for consistent API shapes
  - Generate API client types for frontend consumption
- **Effort**: ⏱️ 4-6 hours

> **Total Phase 2 Effort**: ⏱️ ~18-28 hours

---

## PHASE 3 🟢 FEATURE COMPLETENESS

### 3.1 Testing Infrastructure
- **Actions**:
  - Set up Vitest for unit tests
  - Set up Playwright for E2E tests
  - Add API integration tests for critical paths (auth, CRUD)
  - Add CI gate: tests must pass before merge
  - Achieve >60% test coverage on critical modules
- **Effort**: ⏱️ 8-12 hours

### 3.2 Frontend Polish
- **Issues identified**:
  - Some pages use raw `fetch()` instead of Axios interceptor
  - `GET /api/s3/config` called from frontend unnecessarily
  - Inconsistent error handling across pages
- **Actions**:
  - Audit all frontend API calls → migrate to Axios `api.ts` service
  - Add loading skeletons to all data-fetching pages
  - Add error boundaries to admin panels
  - Implement optimistic UI updates for CRUD operations
  - Add toast notification system for user feedback
- **Effort**: ⏱️ 6-8 hours

### 3.3 Redis Integration
- **Issue**: `REDIS_URL` env var exists but is never used
- **Actions**:
  - Wire Redis for session caching
  - Cache frequent queries (settings, menus, site config)
  - Implement rate limiter backing store (instead of in-memory)
  - Cache AI chat contexts for PressAgent
  - Implement job queue for async tasks (email, newsletter)
- **Effort**: ⏱️ 4-6 hours

### 3.4 Telegram Bot Persistence
- **Issue**: Wizard state stored in in-memory `telegramSessions` Map — lost on restart
- **Actions**:
  - Migrate Telegram session state to Redis or DB
  - Add state expiration TTL
  - Add session recovery on restart
- **Effort**: ⏱️ 2-3 hours

> **Total Phase 3 Effort**: ⏱️ ~20-29 hours

---

## PHASE 4 🔵 DEVOPS & INFRASTRUCTURE

### 4.1 CI/CD Pipeline
- **Actions**:
  - Set up GitHub Actions for CI (lint → typecheck → test → build)
  - Add CD for staging/production (Vercel + backend)
  - Add automated DB migration on deploy
  - Add smoke tests post-deploy
- **Effort**: ⏱️ 4-6 hours

### 4.2 Monitoring & Observability
- **Actions**:
  - Add structured logging (pino/winston)
  - Add request logging middleware (method, path, status, duration)
  - Set up error tracking (Sentry or similar)
  - Add performance monitoring for API endpoints
  - Add uptime monitoring
- **Effort**: ⏱️ 4-6 hours

### 4.3 Production Readiness
- **Actions**:
  - Environment-specific config validation
  - Graceful shutdown handling
  - Database connection pooling tuning
  - Static asset caching strategy
  - Backup strategy for SQLite/PostgreSQL
  - Add `HEALTHCHECK` for containerized deployment
- **Effort**: ⏱️ 4-6 hours

> **Total Phase 4 Effort**: ⏱️ ~12-18 hours

---

## PHASE 5 🟣 AI & PLATFORM EVOLUTION

### 5.1 Vector Database & RAG
- **Issue**: No semantic search, no embeddings, no RAG pipeline
- **Actions**:
  - Add pgvector (PostgreSQL) or standalone vector DB
  - Create embedding pipeline for articles, projects, violations
  - Implement semantic search across all content types
  - Ground AI chat assistant with RAG for better responses
  - Add "related content" via vector similarity
- **Effort**: ⏱️ 8-12 hours

### 5.2 AI Streaming & Cost Tracking
- **Actions**:
  - Implement SSE/streaming for AI chat responses
  - Add token usage tracking per request
  - Add cost monitoring dashboard for AI endpoint usage
  - Implement request caching for repeated AI queries
- **Effort**: ⏱️ 4-6 hours

### 5.3 Gemini Integration
- **Issue**: `GEMINI_API_KEY` configured, `@google/genai` dependency present, but never used
- **Actions**:
  - Decide: Replace or complement NVIDIA NIM with Gemini?
  - If keeping both: implement feature parity across both providers
  - Add dynamic model selection in AI settings
- **Effort**: ⏱️ 3-5 hours

### 5.4 Performance Optimization
- **Actions**:
  - Database query optimization (missing indexes, N+1 queries)
  - Frontend bundle optimization (code splitting, lazy loading)
  - Image optimization pipeline (serve WebP, responsive sizes)
  - Implement CDN caching for static assets
  - Lighthouse audit targets: Performance >85, Accessibility >90, SEO >95
- **Effort**: ⏱️ 6-10 hours

> **Total Phase 5 Effort**: ⏱️ ~21-33 hours

---

## 📊 EFFORT SUMMARY

| Phase | Focus | Hours | Priority |
|---|---|---|---|
| **Phase 1** 🔴 | Security Hardening | 21-28h | 🚨 DO NOT SHIP WITHOUT |
| **Phase 2** 🟡 | Backend Modularization | 18-28h | High |
| **Phase 3** 🟢 | Feature Completeness | 20-29h | Medium |
| **Phase 4** 🔵 | DevOps & Infrastructure | 12-18h | Medium |
| **Phase 5** 🟣 | AI & Platform Evolution | 21-33h | Low |
| **Total** | **All Phases** | **~92-136h** | |

---

## 🧭 DEPENDENCY GRAPH

```
Phase 1 (Security)
  ├── 1.1 Auth Middleware ──► enables safe admin operations
  ├── 1.2 JWT Upgrade ─────► unblocks CSRF + httpOnly cookies
  ├── 1.3 Input Validation ► needed before anyone can write
  ├── 1.4 SQL Injection ───► must fix before production
  ├── 1.5 File Upload ─────► security gap in content pipeline
  ├── 1.6 MCP Hardening ───► blocks dangerous API surface
  └── 1.7 CSRF ───────────► completes auth security layer
         │
         ▼
Phase 2 (Modularization)
  ├── 2.1 Server Split ────► enables independent testing
  ├── 2.2 DB Layer ────────► decouples routes from SQL
  └── 2.3 API Docs ───────► must be done before public API
         │
         ▼
Phase 3 (Features)
  ├── 3.1 Tests ──────────► enables safe refactoring
  ├── 3.2 Frontend Polish ► needs stable API from Phase 2
  ├── 3.3 Redis ──────────► needs env config from Phase 4
  └── 3.4 Telegram Persist► independent
         │
         ▼
Phase 4 (DevOps)
  ├── 4.1 CI/CD ──────────► needs Phase 1 + 2 to be stable first
  ├── 4.2 Monitoring ─────► independent but useful early
  └── 4.3 Production ─────► final gate before go-live
         │
         ▼
Phase 5 (AI Evolution)
  ├── 5.1 Vector RAG ─────► needs stable API from Phase 2
  ├── 5.2 AI Streaming ───► independent
  ├── 5.3 Gemini ─────────► independent
  └── 5.4 Performance ────► can start in parallel with other phases
```

---

## 🏁 FIRST COMMIT READINESS

The repo has **0 commits** with all files staged. Recommend:
1. Stage all current changes (including the DISCOVERY fixes)
2. Commit as `feat: initial PressHouse CMS codebase with security hardening`
3. Begin Phase 1 work on a new branch

```bash
git add -A && git commit -m "feat: initial PressHouse CMS codebase with security hardening"
```
