# PressHouse CMS - Agent Rules & Context

This file contains persistent rules and context for AI coding agents working on the PressHouse project.

## Core Identity
- **Project Name**: PressHouse (بيت الصحافة - اليمن)
- **Sector**: Media, Civil Society, Human Rights.
- **Tone**: Professional, journalistic, high-contrast modern design.

## Technical Stack
- **Frontend**: React 19, Tailwind CSS 4, Framer Motion, Lucide Icons, Swiper.
- **Backend**: Node.js (tsx), Express.
- **Database**: SQLite (local) with `better-sqlite3`. MySQL/MariaDB compatible for production.
- **Localization**: `i18next` with Arabic (RTL) as primary and English (LTR) as secondary.
- **SEO**: `react-helmet-async`. Meta tags are managed via settings.

## Developer Rules
1. **RTL Support**: Always ensure RTL compatibility using `dir="rtl"` or checking `i18n.language === 'ar'`. Use `rtl:` and `ltr:` classes where necessary.
2. **Design Language**: 
   - Use "Inter" font for general UI and "Space Grotesk" or similar for headings (Google Fonts).
   - Prefer rounded corners (`rounded-2xl`, `rounded-[48px]`).
   - Use high-contrast slate-900 for dark text and white backgrounds.
3. **Database Migrations**: Add migrations to `src/db.ts` using `try-catch` blocks for `ALTER TABLE` statements to ensure idempotency.
4. **Environment Variables**:
   - `GEMINI_API_KEY`: Server-side only.
   - `VITE_ADMIN_PATH`: Custom path for admin dashboard.
   - `VITE_ROOT_PATH`: Custom path for system superuser dashboard.
5. **AI Ethics**: The AI Chat Assistant (`/api/ai/chat`) must be visitor-oriented. It must NEVER perform admin actions or mention its internal model name.

## Directory Structure
- `/src/components`: Reusable UI components.
- `/src/pages`: Page components organized by user role (admin, staff, journalist, root).
- `/src/services`: API services and AI service wrappers.
- `/src/context`: React Context providers (Auth, etc.).
- `/uploads`: Directory for media uploads (should be synced/persisted).

## Security
- Passwords must be hashed with `bcryptjs`.
- JWT used for session management.
- File uploads are restricted by mimetype.

---

# Comprehensive Backend Analysis

## Server Architecture (`server.ts` — 6855 lines)

### Express Server Setup
- **Vite integration**: `createViteServer()` middleware in dev mode; serves `dist/` static files in production
- **CORS**: `cors()` middleware with `origin: true` (reflects request origin), `credentials: true`
- **Body parsing**: `express.json({ limit: '50mb' })`, `express.urlencoded({ extended: true })`
- **Static files**: `/uploads` served via `express.static`
- **No `helmet()`**: No security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- **No rate limiting**: All endpoints exposed to brute force/abuse
- **No CSRF protection**: Cookie-based attacks possible

### Database: Dual Driver (`src/db.ts`)
- **Primary**: PostgreSQL via `pg` Pool when `POSTGRES_URL` env var is set
- **Fallback**: SQLite via `better-sqlite3` when no `POSTGRES_URL`
- **Auto-migration**: Reads `schema.sql`, rewrites keywords per dialect (`SERIAL`→`INTEGER PRIMARY KEY AUTOINCREMENT`, `JSON`→`TEXT`, strips `ENGINE=InnoDB`), executes on startup
- **No ORM**: Raw SQL queries throughout

### Schema (`schema.sql`) — 20 Tables
| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Auth users | `uid`, `email`, `password_hash`, `displayName`, `role` (ENUM: admin, journalist, staff, super, suspended), `department_id`, `team_id`, `system_role_id` |
| `departments` | Org structure | `id`, `name_ar`, `name_en`, `description` |
| `teams` | Sub-department teams | `id`, `name_ar`, `name_en`, `department_id` (FK) |
| `system_roles` | Permission roles | `id`, `name_ar`, `name_en`, `permissions` (JSON) |
| `articles` | Content | `id`, `title` (JSON), `content` (JSON), `category` (ENUM: news, report, article, press, interview, story), `mainImage`, `status` (ENUM: draft, published, archived), `language`, `tags` (JSON), `featured`, `show_in_slider`, `slider_caption/button_text/image`, `authorId`, `views`, `createdAt` |
| `events` | Calendar | `id`, `title` (JSON), `description` (JSON), `event_date`, `location`, `image`, `status`, `show_in_slider`, slider fields |
| `violations` | Human rights | `id`, `victimName`, `type`, `description`, `date`, `governorate`, `status` (ENUM: pending, approved, rejected), `lat`, `lng`, `media` (JSON) |
| `violation_potentials` | Raw reports | `id`, `victimName`, `type`, `description`, `date`, `governorate`, `status`, `media` (JSON), `matches` (JSON) |
| `media` | File manager | `id`, `url`, `filename`, `type`, `size`, `alt`, `uploadedBy`, `createdAt` |
| `site_settings` | Config | `id`, `siteName` (JSON), `logo`, `favicon`, `primaryColor`, `secondaryColor`, `fontFamily`, `socialLinks` (JSON), `contactEmail/Phone`, `address` (JSON), `seoTitle/Description/Keywords` (JSON), `ogDefaultImage/SiteName/Type`, `googleVerification`, `bingVerification`, `aiEnabled/Model/BaseUrl/ApiKey/Temperature/MaxTokens/SystemInstruction`, `fbAppId/AppSecret/CharityId/AccessToken/WebhookVerifyToken/SandboxMode`, `s3Enabled/Provider/AccessKeyId/SecretAccessKey/Region/Bucket/Endpoint`, `sliderAutoplayDelay/TransitionSpeed`, `sshPublicKey`, `tunnelingEnabled`, `livestream` (JSON), `youtubeChannelId/PlaylistUrl` |
| `hero_slides` | Carousel | `id`, `title/subtitle/description` (JSON), `mediaType`, `mediaUrl`, `animationType`, `textAnimation`, `titleSize/SubtitleSize/DescriptionSize/ButtonSize`, `overlayOpacity`, `textAlign`, `primaryButton/secondaryButton` (JSON), `order`, `isActive` |
| `sectors` | Strategic sectors | `id`, `name_ar/en`, `description_ar/en`, `image`, `icon`, `color`, `sort_order`, `status` |
| `programs` | Programs within sectors | `id`, `name`, `description`, `imageurl`, `icon`, `category`, `sector_id` (FK), `description_full_ar/en`, `status` |
| `projects` | Projects within programs | `id`, `title` (JSON), `description` (JSON), `start_date`, `end_date`, `status`, `fundingGoal`, `currentFunding`, `beneficiaries_count/direct/indirect`, `location_governorate/district`, `sector_id` (FK), `program_id` (FK), `image` |
| `courses` | Academy courses | `id`, `title` (JSON), `description` (JSON), `trainer` (JSON), `applicationDeadline`, `status`, `announcementImage`, `show_in_slider`, slider fields |
| `academy_applications` | Course enrollments | `id`, `course_id` (FK), `full_name`, `email`, `phone`, `education`, `status`, `createdAt` |
| `academy_certificates` | Graduation certs | `id`, `course_id` (FK), `recipient_name/email`, `type`, `issue_date`, `status` |
| `volunteer_registry` | Volunteer DB | `id`, `volunteer_id`, `full_name`, `gender`, `location`, `phone`, `email`, `preferred_areas`, `skills`, `status`, `registration_date` |
| `volunteer_hours` | Time tracking | `id`, `volunteer_id` (FK), `project_id` (FK), `activity`, `date`, `hours_worked`, `status` |
| `success_stories` | Impact stories | `id`, `title_ar/en`, `project_id/program_id/sector_id` (FK), `beneficiary_name/role`, `content_ar/en`, `images` (JSON), `video_url`, `tags` (JSON), `status` |
| `testimonials` | Quotes | `id`, `name`, `photo_url`, `role`, `organization`, `content_ar/en`, `rating`, `project_id/program_id/sector_id` (FK) |
| `indicators` | KPI tracking | `id`, `project_id` (FK), `name`, `target_value`, `current_value`, `unit` |
| `impact_widgets` | Embeddable widgets | `id`, `title`, `type`, `settings` (JSON) |
| `tenders` | Procurement | `id`, `title` (JSON), `description` (JSON), `documents` (JSON), `deadline`, `status`, `createdAt` |
| `subscribers` | Newsletter | `id`, `email`, `source`, `createdAt` |
| `institution_identity` | Brand profile | `id=1`, `name_ar/en`, `description_ar/en`, `vision_ar/en`, `mission_ar/en`, `goals` (JSON), `work_fields` (JSON), `logo_main/colored/dark/white`, `favicon`, `primaryColor`, `secondaryColor`, `accentColor`, `fontArPrimary/Secondary`, `fontEnPrimary/Secondary` |
| `employees` | HR | `id`, `full_name`, `employee_id`, `position`, `department`, `photo_url`, `email`, `phone`, `status` |
| `board_members` | Governance | `id`, `full_name`, `position`, `photo_url`, `bio`, `sort_order`, `category` |
| `partners` | Donor/partner orgs | `id`, `name`, `type`, `logo`, `country`, `website`, `contact_person` |
| `contacts` | Inquiries | `id`, `name`, `email`, `subject`, `message`, `createdAt` |
| `feedback` | Platform feedback | `id`, `userId`, `username`, `message`, `type`, `page`, `createdAt` |
| `page_content` | CMS page sections | `id`, `page_name`, `section_name`, `content` (JSON), `updatedAt` |
| `menus` | Navigation | `id`, `location`, `title` (JSON), `icon`, `path`, `order`, `isActive` |
| `newsletter_history` | Sent newsletters | `id`, `subject`, `content`, `recipientCount`, `sent_at` |
| `facebook_fundraisers` | FB fundraising | `id`, `title`, `description`, `goal_amount`, `amount_raised`, `currency`, `charity_id`, `external_uri`, `status`, `end_time`, `createdAt` |
| `api_tokens` | Developer tokens | `id`, `token`, `name`, `role`, `createdAt` |
| `yemenjpt_beta_registrations` | YemenJPT signups | `id`, `fullName`, `email`, `organization`, `specialization`, `createdAt` |
| `custom_lists` | Generic KV store | `id`, `list_key`, `list_value` (JSON/TEXT) |
| `tasks` | Project management | `id`, `title`, `description`, `assigned_to`, `project_id`, `status`, `due_date`, `createdAt` |

---

## Complete API Route Inventory (all 150+ endpoints)

### AUTH SYSTEM
| Method | Path | Auth | Description | Frontend Consumer |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user account | Register.tsx |
| POST | `/api/auth/login` | No | Login, returns JWT + user profile | Login.tsx |
| POST | `/api/auth/login-v2` | No | Alternative login with bcrypt compare | (legacy) |
| GET | `/api/auth/profile` | **JWT** | Get current user profile by token | AuthContext (on mount), Navbar |
| POST | `/api/auth/change-password` | **JWT** | Change password (old→new) | admin/Profile.tsx |
| POST | `/api/auth/reset-password` | No | Request password reset email | ForgotPassword.tsx |
| POST | `/api/auth/reset-password/:token` | No | Reset password with token | ResetPassword.tsx |
| POST | `/api/auth/verify-email` | No | Email verification token | (planned) |
| PUT | `/api/users/:uid` | No* | Update user (role, displayName, photoURL) | admin/Users.tsx |
| DELETE | `/api/users/:uid` | No* | Delete user | admin/Users.tsx |
| GET | `/api/users` | No* | List all users (excludes password_hash) | admin/Users.tsx |
| POST | `/api/users` | No | Create user (email, password, displayName, role) | admin/Users.tsx |
| *No auth middleware applied — handler does its own partial checks* |

### ARTICLES / CONTENT
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/articles` | No | List articles (filterable: `?category=`, `?status=`, `?featured=`, `?limit=`) | News.tsx, FeaturedNews, search, homepage |
| GET | `/api/articles/:id` | No | Get single article | NewsDetail.tsx |
| POST | `/api/articles` | **JWT** | Create article | admin/Articles.tsx, staff/Articles.tsx |
| PUT | `/api/articles/:id` | **JWT** | Update article | admin/Articles.tsx, staff/Articles.tsx |
| DELETE | `/api/articles/:id` | **JWT** | Delete article | admin/Articles.tsx |
| GET | `/api/featured-articles` | No | Get featured articles | HomePage |
| GET | `/api/related-articles/:id` | No | Get related articles by category/tags | NewsDetail.tsx |

### EVENTS
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/events` | No | List events (filterable: `?status=`) | Events.tsx, HomePage |
| GET | `/api/events/:id` | No | Get single event | EventDetail.tsx |
| POST | `/api/events` | **JWT** | Create event | admin/Events.tsx |
| PUT | `/api/events/:id` | **JWT** | Update event | admin/Events.tsx |
| DELETE | `/api/events/:id` | **JWT** | Delete event | admin/Events.tsx |

### VIOLATIONS
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/violations` | No | List violations (filterable: `?governorate=`, `?status=approved`) | Violations.tsx, MapView |
| GET | `/api/violations/:id` | No | Get single violation | ViolationDetail.tsx |
| POST | `/api/violations` | No | Report violation | ViolationForm.tsx |
| PUT | `/api/violations/:id` | **JWT** | Update violation | admin/Violations.tsx |
| DELETE | `/api/violations/:id` | **JWT** | Delete violation | admin/Violations.tsx |
| POST | `/api/violations/bulk-approve` | **JWT** | Approve multiple violations | admin/Violations.tsx |
| GET | `/api/violation-potentials` | No | List raw/unreviewed potential violations | admin/Violations.tsx |
| PUT | `/api/violation-potentials/:id/mark-reviewed` | **JWT** | Mark potential as reviewed | admin/Violations.tsx |
| POST | `/api/violation-potentials` | No | Submit potential violation | ViolationForm.tsx |

### MEDIA / FILES
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/media` | No | List media items | Media gallery, admin/Media.tsx |
| POST | `/api/upload` | No | Upload file (multer + S3 fallback) | admin/Media.tsx, image uploads |
| GET | `/api/s3/config` | No | Returns S3 credentials (⚠️ security risk) | storage.ts |
| DELETE | `/api/media/:id` | No* | Delete media record | admin/Media.tsx |
| GET | `/api/media/resolve` | No | Resolve media URL to blob URL | Media components |

### ACADEMY / COURSES
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/courses` | No | List courses | Academy.tsx |
| POST | `/api/courses` | **JWT** | Create course | admin/Academy.tsx |
| PUT | `/api/courses/:id` | **JWT** | Update course | admin/Academy.tsx |
| DELETE | `/api/courses/:id` | **JWT** | Delete course | admin/Academy.tsx |
| GET | `/api/academy/applications` | No* | List applications | JobApplicationModal? |
| POST | `/api/academy/apply` | No | Submit course application | Academy.tsx |
| PUT | `/api/academy/applications/:id/status` | **JWT** | Update application status | admin/Academy.tsx |
| GET | `/api/academy/certificates` | No | List certificates | Academy.tsx |
| POST | `/api/academy/certificates` | **JWT** | Issue certificate | admin/Academy.tsx |

### CONTACTS / FEEDBACK
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| POST | `/api/contact` | No | Submit contact form | Contact.tsx |
| GET | `/api/contacts` | No* | List all contacts | admin/Contacts.tsx |
| DELETE | `/api/contacts/:id` | No* | Delete contact | admin/Contacts.tsx |
| POST | `/api/feedback` | No | Submit feedback | FeedbackWidget |
| GET | `/api/feedback` | No* | List feedback | admin/Dashboard.tsx |
| DELETE | `/api/feedback/:id` | No* | Delete feedback | admin/Contacts.tsx |

### AI INTEGRATION
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| POST | `/api/ai/chat` | No | AI chat assistant (session-based, visitor-oriented) | PressAgentChat.tsx |
| POST | `/api/ai/translate` | No | Translate text (AR↔EN) | admin/Articles.tsx |
| POST | `/api/ai/format-post` | No | Format/draft article content | admin/Articles.tsx |
| POST | `/api/ai/generate-seo` | No | Generate SEO metadata | admin/Articles.tsx |
| POST | `/api/ai/command` | No | Internal command/query (violation analysis, TAQI, YemenJPT) | PressAgentChat.tsx |
| GET | `/api/ai/models` | No | List available AI models | components |
| GET | `/api/ai/usage` | No | AI usage stats | admin/Analytics.tsx |
| POST | `/api/ai/generate-image` | No | Generate image via AI | admin/Articles.tsx |
| **Backend**: `getPressAgent()` from `src/services/pressAgent.ts` — OpenAI-compatible client using `AI_API_KEY`/`AI_BASE_URL` from env or DB `site_settings` |

### SEARCH
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/search` | No | Global search (articles, events, violations) | SpotlightSearch.tsx, Navbar |

### VOLUNTEER
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/volunteers` | No | List volunteers | admin/Volunteers.tsx |
| POST | `/api/volunteers` | No | Register volunteer | BecomeVolunteer.tsx |
| PUT | `/api/volunteers/:id` | No* | Update volunteer | admin/Volunteers.tsx |
| DELETE | `/api/volunteers/:id` | No* | Delete volunteer | admin/Volunteers.tsx |
| GET | `/api/volunteer-hours` | No | List volunteer hours | admin/Volunteers.tsx |
| POST | `/api/volunteer-hours` | No* | Log volunteer hours | admin/Volunteers.tsx |
| PUT | `/api/volunteer-hours/:id` | No* | Update hours entry | admin/Volunteers.tsx |

### ANALYTICS / IMPACT
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/analytics/comprehensive` | No | Full dashboard stats + charts (yearlyGrowth, sectorDistribution, genderDistribution, governorates) | admin/Dashboard.tsx, ImpactPage |
| GET | `/api/analytics/drilldown?entity=` | No | Drill-down detail for entity (projects, beneficiaries, courses, volunteers, hours, stories, events, reports, certificates) | admin/Dashboard.tsx |
| GET | `/api/analytics/impact` | No | Aggregated impact metrics (SUM/COUNT) | ImpactPage |
| GET | `/api/analytics/widgets` | No | List embeddable widgets | Embed builder |
| POST | `/api/analytics/widgets` | No* | Create widget | admin |
| DELETE | `/api/analytics/widgets/:id` | No* | Delete widget | admin |
| GET | `/api/analytics/embed/:id` | No | Public widget embed (JSON data) | External sites (iframe) |
| GET | `/api/analytics/indicators` | No | List KPI indicators | admin/Analytics.tsx |
| POST | `/api/analytics/indicators` | No* | Create indicator | admin/Analytics.tsx |
| PUT | `/api/analytics/indicators/:id` | No* | Update indicator | admin/Analytics.tsx |
| DELETE | `/api/analytics/indicators/:id` | No* | Delete indicator | admin/Analytics.tsx |

### SECTORS / PROGRAMS / PROJECTS
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/sectors` | No | List sectors | Sectors.tsx, Programs.tsx |
| POST | `/api/sectors` | No* | Create sector | admin |
| PUT | `/api/sectors/:id` | No* | Update sector | admin |
| DELETE | `/api/sectors/:id` | No* | Delete sector | admin |
| GET | `/api/programs` | No | List programs | Programs.tsx |
| POST | `/api/programs` | No* | Create program | admin |
| PUT | `/api/programs/:id` | No* | Update program | admin |
| DELETE | `/api/programs/:id` | No* | Delete program | admin |
| GET | `/api/projects` | No | List projects (filterable: `?status=`, `?sector=`) | Projects.tsx |
| GET | `/api/projects/:id` | No | Get single project | ProjectDetail.tsx |
| POST | `/api/projects` | No* | Create project | admin/Projects.tsx |
| PUT | `/api/projects/:id` | No* | Update project | admin/Projects.tsx |
| DELETE | `/api/projects/:id` | No* | Delete project | admin/Projects.tsx |

### SETTINGS
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/settings` | No | Get site settings (siteName, socialLinks, SEO, AI config, FB config, S3 config, etc.) | Layout, Navbar, SEO helmet |
| POST | `/api/settings` | No* | Save all site settings | admin/Settings.tsx |

### HERO SLIDES
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/heroSlides` | No | List hero slides | HeroSlider |
| POST | `/api/heroSlides` | No* | Create hero slide | admin/HeroSlides.tsx |
| PUT | `/api/heroSlides/:id` | No* | Update hero slide | admin/HeroSlides.tsx |
| DELETE | `/api/heroSlides/:id` | No* | Delete hero slide | admin/HeroSlides.tsx |
| GET | `/api/dynamic-hero-slides` | No | Auto-generated slides (violation stats + latest news + upcoming events + pinned projects/courses) | HeroSlider |

### TELEGRAM BOT (inline in server.ts)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/telegram/webhook` | No | Telegram bot webhook handler |
| GET | `/api/telegram/webhook` | No | Webhook verification (GET challenge) |
| GET | `/api/telegram/set-webhook` | No | Register webhook URL with Telegram API |
| **Bot capabilities**: `/start`, `/article`, `/violation`, `/media`, `/cancel`, `/status` — inline wizard using in-memory `telegramSessions` Map |
| **Warning**: Bot token from `.env` (`BOT_TOKEN`) — exposed in env file |

### SUCCESS STORIES & TESTIMONIALS
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/success-stories` | No | List success stories | SuccessStories.tsx |
| POST | `/api/success-stories` | No* | Create story | admin/SuccessStories.tsx |
| PUT | `/api/success-stories/:id` | No* | Update story | admin |
| DELETE | `/api/success-stories/:id` | No* | Delete story | admin |
| GET | `/api/testimonials` | No | List testimonials | TestimonialsSection |
| POST | `/api/testimonials` | No* | Create testimonial | admin |
| PUT | `/api/testimonials/:id` | No* | Update testimonial | admin |
| DELETE | `/api/testimonials/:id` | No* | Delete testimonial | admin |

### FACEBOOK FUNDRAISER
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/facebook/fundraisers` | No | List fundraisers (seeds mock data if empty) |
| POST | `/api/facebook/fundraisers` | No | Create fundraiser (sandbox or live FB Graph API) |
| POST | `/api/facebook/fundraisers/:id/donate` | No | Simulate donation (updates amount_raised) |
| DELETE | `/api/facebook/fundraisers/:id` | No | Delete fundraiser |
| GET | `/api/facebook/analytics` | No | Fundraiser analytics (total raised, goals) |

### PAGE CONTENT & MENUS
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/page-content` | No | List page names | CMS editor |
| GET | `/api/page-content/:page` | No | Get page sections | About.tsx, dynamic pages |
| POST | `/api/page-content` | No* | Upsert page section | admin/Pages.tsx |
| GET | `/api/menus` | No | List menu items | Navbar, Footer |
| POST | `/api/menus` | No* | Create menu item | admin/Menus.tsx |
| PUT | `/api/menus/:id` | No* | Update menu | admin |
| DELETE | `/api/menus/:id` | No* | Delete menu | admin |

### INSTITUTION IDENTITY
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/institution-identity` | No | Get brand identity (id=1) | Institution branding |
| POST | `/api/institution-identity` | No* | Update brand identity | admin/Identity.tsx |

### SUBSCRIBERS / NEWSLETTER
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/subscribers` | No* | List subscribers | admin/Newsletter.tsx |
| POST | `/api/subscribers` | No | Subscribe email | NewsLetterSubscription.tsx |
| DELETE | `/api/subscribers/:id` | No* | Unsubscribe | admin |
| GET | `/api/newsletter-history` | No | List sent newsletters | admin |
| POST | `/api/newsletter-history` | No* | Log sent newsletter | admin |

### TENDERS
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| GET | `/api/tenders` | No | List tenders | Tenders.tsx |
| POST | `/api/tenders` | No* | Create tender | admin |
| PUT | `/api/tenders/:id` | No* | Update tender | admin |
| DELETE | `/api/tenders/:id` | No* | Delete tender | admin |

### EMPLOYEES / BOARD / PARTNERS
| Method | Path | Auth | Description |
|---|---|---|---|
| GET/POST/PUT/DELETE | `/api/employees` | No/No* | HR employee CRUD |
| GET/POST/PUT/DELETE | `/api/board-members` | No/No* | Board member CRUD |
| GET/POST/PUT/DELETE | `/api/partners` | No/No* | Partner organization CRUD |

### DEPARTMENTS / TEAMS / SYSTEM ROLES / TASKS
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/departments` | No | List departments |
| POST | `/api/departments` | No* | Create department |
| GET | `/api/teams` | No | List teams |
| GET | `/api/system-roles` | No | List system roles |
| GET | `/api/tasks` | No | List tasks |
| POST | `/api/tasks` | No* | Create task |
| PUT | `/api/tasks/:id/status` | No* | Update task status |

### CUSTOM LISTS
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/custom-lists` | No | List all custom lists |
| GET | `/api/custom-lists/:key` | No | Get single custom list |
| PUT | `/api/custom-lists/:key` | No* | Upsert custom list (by key) |

### YEMENJPT
| Method | Path | Auth | Description | Frontend |
|---|---|---|---|---|
| POST | `/api/yemenjpt/register` | No | Register for YemenJPT beta | YemenJPT.tsx |

### DEVELOPER TOKENS
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/developer/tokens` | No* | List API tokens |
| POST | `/api/developer/tokens` | No* | Create API token |
| DELETE | `/api/developer/tokens/:id` | No* | Delete API token |

### MCP (Model Context Protocol)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/mcp/tools` | No | List MCP tools (get_system_stats, get_schema, query_table, execute_write) |
| POST | `/api/mcp/execute` | No | Execute MCP tool (server-side DB queries) |
| **Note**: `execute_write` blocks DROP TABLE/DATABASE but allows arbitrary INSERT/UPDATE/DELETE |

### EMAIL / NOTIFICATIONS
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/send-email` | No | Send email via nodemailer (SMTP Office365 from .env) |
| POST | `/api/send-bulk-email` | No* | Send newsletter to subscribers |
| **SMTP Config**: `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587`, auth from `.env` |

### SYSTEM
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check (`{ status: 'ok' }`) |
| GET | `/api/admin/endpoints` | No | Hardcoded endpoint list (documentation) |
| GET | `/api/cloudflare/*` | proxy? | DNS/Cloudflare management (details in CloudflareManager.tsx) |

---

## Auth System Deep Dive
- **JWT**: `jsonwebtoken` with 24h expiry, stored in `localStorage`
- **No refresh tokens**: Single token, no rotation
- **No httpOnly cookies**: XSS-vulnerable pattern
- **Auth middleware** (`authenticateToken`): Verifies `Authorization: Bearer <token>` header, extracts `user` from JWT payload, attaches `req.user`
- **Role checks**: Middleware checks like `if (req.user.role !== 'admin')` used inline in some handlers
- **Registration**: `bcryptjs` hash (10 rounds), email uniqueness check
- **Profile**: `GET /api/auth/profile` returns `{ uid, email, displayName, role, photoURL, department_id, team_id, system_role_id }`
- **⚠️ No auth middleware on most admin CRUD endpoints**: Many POST/PUT/DELETE endpoints lack `authenticateToken` middleware — they rely on inline checks or none at all

## Email System
- **Library**: `nodemailer`
- **SMTP**: Office365 (`smtp.office365.com:587`)
- **Auth env vars**: `SMTP_EMAIL`, `SMTP_PASSWORD`
- **From address**: `SMTP_FROM`
- **Used for**: Contact form notifications, password reset, newsletter

## Telegram Bot
- **Library**: `node-telegram-bot-api` (polling mode in dev)
- **Webhook**: POST/GET `/api/telegram/webhook`
- **State**: In-memory `telegramSessions` Map — lost on restart
- **Commands**: `/start`, `/article` (wizard), `/violation` (wizard), `/media` (wizard), `/cancel`, `/status`
- **Warning**: In-memory state = wizard progress lost on server restart

## AI Integration
- **Client**: `src/services/pressAgent.ts` — OpenAI-compatible singleton
- **Config**: Reads `AI_API_KEY` + `AI_BASE_URL` from env or `site_settings` DB table
- **Model**: Nvidia Nemotron (via `AI_BASE_URL`)
- **Endpoints**: Chat, translate, format-post, generate-seo, command (violation analysis, YemenJPT)
- **Frontend service**: `src/services/AIService.ts` — client-side API wrapper

## File Upload System
- **Library**: `multer` with `diskStorage` → `uploads/` directory
- **File filter**: Extension whitelist (jpg, jpeg, png, gif, webp, svg, pdf, doc, docx, mp4, mp3)
- **⚠️ No magic byte verification**: MIME type from extension only
- **Storage layers**: Local `uploads/` → Vercel Blob (production) → S3 (Thirdweb) fallback
- **⚠️ S3 credentials exposed**: `GET /api/s3/config` returns accessKeyId/secretAccessKey to all authenticated users
- **⚠️ Hardcoded S3 creds**: `src/services/storage.ts` has inline S3 keys for Thirdweb

## Critical Security Issues
1. **No Helmet** — no CSP, X-Frame-Options, X-Content-Type-Options
2. **No Rate Limiting** — login, upload, contact endpoints vulnerable to brute force
3. **No CSRF Protection**
4. **S3 config endpoint leaks credentials** (`GET /api/s3/config`)
5. **Hardcoded S3 keys in client-side code** (`src/services/storage.ts`)
6. **Telegram bot token in `.env`** — anyone with token controls the bot
7. **Admin credentials in `.env.example`** — `admin@ph-ye.org` / `change-me-please`
8. **JWT secret hardcoded in `.env.example`** — `super-secret-unique-hash-key-for-jwt-tokens-2026`
9. **SQL injection potential** — template literals in some queries (e.g., `ORDER BY ${sortOrder}`)
10. **No input validation library** — no zod/joi/express-validator
11. **Most admin endpoints lack auth middleware** — rely on inline checks or none
12. **MCP execute_write** — allows arbitrary DB mutations via API (only blocks DROP)
13. **Redis URL configured but unused** — planned for queue/session/cache but not wired

## Frontend Page → Backend API Mapping (complete)
| Page Component | Route | API Calls |
|---|---|---|
| `HomePage` | `/` | `GET /api/featured-articles`, `GET /api/heroSlides`, `GET /api/dynamic-hero-slides`, `GET /api/events`, `GET /api/violations`, `GET /api/success-stories`, `GET /api/testimonials`, `GET /api/settings`, `GET /api/institution-identity`, `GET /api/analytics/impact`, `GET /api/analytics/comprehensive` |
| `News` | `/news` | `GET /api/articles` |
| `NewsDetail` | `/news/:id` | `GET /api/articles/:id`, `GET /api/related-articles/:id` |
| `Events` | `/events` | `GET /api/events` |
| `EventDetail` | `/events/:id` | `GET /api/events/:id` |
| `Violations` | `/violations` | `GET /api/violations` |
| `ViolationDetail` | `/violations/:id` | `GET /api/violations/:id` |
| `ViolationForm` | (component) | `POST /api/violations`, `POST /api/violation-potentials` |
| `About` | `/about` | `fetch()` directly to `/api/settings`, `/api/institution-identity`, `/api/employees`, `/api/board-members`, `/api/partners` |
| `Academy` | `/academy` | `GET /api/courses`, `GET /api/academy/applications`, `GET /api/academy/certificates` |
| `Programs` | `/programs` | `GET /api/sectors`, `GET /api/programs`|
| `Projects` | `/projects` | `GET /api/projects` |
| `ProjectDetail` | `/projects/:id` | `GET /api/projects/:id` |
| `Tenders` | `/tenders` | `GET /api/tenders` |
| `Contact` | `/contact` | `POST /api/contact`, `GET /api/settings` |
| `BecomeVolunteer` | `/volunteer` | `POST /api/volunteers` |
| `SuccessStories` | `/stories` | `GET /api/success-stories`, `GET /api/testimonials` |
| `Impact` | `/impact` | `GET /api/analytics/comprehensive`, `GET /api/analytics/impact` |
| `SpotlightSearch` | (component) | `GET /api/search` |
| `NewsLetterSubscription` | (component) | `fetch()` POST to `/api/subscribers` |
| `PressAgentChat` | (component) | `fetch()` POST to `/api/ai/chat` |
| `Login` | `/login` | `POST /api/auth/login` |
| `Register` | `/register` | `POST /api/auth/register` |
| `ForgotPassword` | `/forgot-password` | `POST /api/auth/reset-password` |
| `ResetPassword` | `/reset-password/:token` | `POST /api/auth/reset-password/:token` |
| `YemenJPT` | `/yemenjpt` | `POST /api/yemenjpt/register` |
| **Admin routes** (under `VITE_ADMIN_PATH`) |
| Dashboard | `/admin` | `GET /api/analytics/comprehensive`, `GET /api/analytics/drilldown`, `GET /api/feedback`, `GET /api/contacts` |
| Articles | `/admin/articles` | `GET /api/articles`, `POST/PUT/DELETE` articles + AI endpoints |
| Events | `/admin/events` | `GET/POST/PUT/DELETE /api/events` + `fetch()` raw |
| Violations | `/admin/violations` | `GET/POST/PUT/DELETE` violations + potentials |
| Media | `/admin/media` | `GET /api/media`, `POST /api/upload`, `DELETE /api/media/:id` |
| Academy | `/admin/academy` | Full courses + applications + certificates CRUD |
| Users | `/admin/users` | `GET/POST/PUT/DELETE /api/users` |
| Settings | `/admin/settings` | `GET/POST /api/settings` |
| Sectors | `/admin/sectors` | Full sector CRUD |
| Programs | `/admin/programs` | Full program CRUD |
| Projects | `/admin/projects` | Full project CRUD |
| Employees | `/admin/employees` | Full employee CRUD |
| Board Members | `/admin/board` | Full board member CRUD |
| Partners | `/admin/partners` | Full partner CRUD |
| Menu | `/admin/menus` | Full menu CRUD |
| Hero Slides | `/admin/hero-slides` | Full hero slide CRUD |
| Pages | `/admin/pages` | Page content CRUD |
| Identity | `/admin/identity` | Institution identity CRUD |
| Contacts | `/admin/contacts` | `GET /api/contacts`, `DELETE` |
| Newsletter | `/admin/newsletter` | `GET /api/subscribers`, `POST /api/newsletter-history` |
| Volunteers | `/admin/volunteers` | Full volunteer CRUD |
| Success Stories | `/admin/stories` | Full success story CRUD |
| Testimonials | `/admin/testimonials` | Full testimonial CRUD |
| Analytics | `/admin/analytics` | Analytics/indicators CRUD |
| Tenders | `/admin/tenders` | Full tender CRUD |
| Facebook | `/admin/facebook` | Facebook fundraiser CRUD |
| Custom Lists | `/admin/custom-lists` | Custom list CRUD |
| Tasks | `/admin/tasks` | Tasks CRUD |
| Api Explorer | `/admin/api-explorer` | `fetch()` to various endpoints |
| Profile | `/admin/profile` | `POST /api/auth/change-password` |
| Developers | `/admin/developers` | Developer tokens CRUD |
| Cloudflare | `/admin/cloudflare` | `fetch()` to `/api/cloudflare/*` |
| **Staff routes** (under staff path) |
| Articles | `/staff/articles` | Restricted article CRUD |
| Profile | `/staff/profile` | Change password |
| **Journalist routes** |
| Articles | `/journalist/articles` | Restricted article CRUD |

## Frontend Services
| Service | File | Purpose |
|---|---|---|
| `api.ts` | `src/services/api.ts` | Axios instance with JWT interceptor, perf tracking, error toasts |
| `AIService.ts` | `src/services/AIService.ts` | Client-side AI endpoints (chat, translate, format, SEO) |
| `pressAgent.ts` | `src/services/pressAgent.ts` | Server-side OpenAI-compatible client |
| `storage.ts` | `src/services/storage.ts` | S3 upload/list/delete (⚠️ hardcoded creds) |
| `AuthContext.tsx` | `src/context/AuthContext.tsx` | JWT localStorage management, profile fetch |

## Environment Variables (.env)
| Variable | Value | Used In |
|---|---|---|
| `POSTGRES_URL` | Neon PostgreSQL connection string | `db.ts` |
| `REDIS_URL` | Redis Cloud URL | `.env` only (not used in server.ts) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | Server (blob upload) |
| `GEMINI_API_KEY` | Google Gemini key | AI endpoints |
| `AI_API_KEY` | Nvidia Nemotron key | `pressAgent.ts` |
| `AI_BASE_URL` | Nvidia NIM endpoint | `pressAgent.ts` |
| `SMTP_EMAIL` / `SMTP_PASSWORD` | Office365 creds | Nodemailer |
| `SMTP_FROM` | From address | Nodemailer |
| `BOT_TOKEN` | Telegram bot token | Telegram bot |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | Thirdweb S3 | Storage service |
| `S3_REGION` / `S3_BUCKET` / `S3_ENDPOINT` | S3 config | Storage service |
| `FIRECRAWL_API_KEY` | Firecrawl API | (future?) |
| `VITE_ADMIN_PATH` | `/control-panel` | Frontend routing |
| `VITE_ROOT_PATH` | `/system-superuser` | Frontend routing |
| `JWT_SECRET` | JWT signing key | Auth middleware |
| `PORT` | 3001 | Server listen |

## Next Steps (Priority Order)
1. **🔴 CRITICAL**: Add `helmet()` middleware for security headers
2. **🔴 CRITICAL**: Add rate limiting (`express-rate-limit`) on auth + upload + contact endpoints
3. **🔴 CRITICAL**: Remove S3 credentials from `GET /api/s3/config` and `src/services/storage.ts`
4. **🟡 HIGH**: Replace localStorage JWT with httpOnly cookie + refresh token pattern
5. **🟡 HIGH**: Add proper auth middleware to all admin CRUD endpoints
6. **🟡 HIGH**: Add input validation (zod/joi) to all POST/PUT endpoints
7. **🟡 HIGH**: Add CSRF protection
8. **🟡 HIGH**: Add SQL injection hardening (parameterized queries for all dynamic clauses)
9. **🟡 HIGH**: Remove admin credentials from `.env.example`
10. **🟡 HIGH**: Remove Telegram bot token from `.env` template
11. **🟢 MEDIUM**: Wire Redis for session/queue/cache (env var already present)
12. **🟢 MEDIUM**: Migrate Telegram wizard state from in-memory Map to DB/Redis
13. **🟢 MEDIUM**: Add file content inspection (magic bytes) to multer upload filter
14. **🟢 MEDIUM**: Consolidate all `fetch()` calls in frontend to use the Axios `api.ts` interceptor
15. **🟢 MEDIUM**: Clean up duplicate route patterns (e.g., `/api/settings`, `/api/institution-identity` serve similar purposes)
16. **🔵 LOW**: Refactor 6855-line `server.ts` into modular route files
17. **🔵 LOW**: Add OpenAPI/Swagger documentation
18. **🔵 LOW**: Seed database with proper migrations instead of inline seed in analytics endpoint
