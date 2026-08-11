<div align="center">
  <img src="https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2023/06/FINAL-SEVEN-STARS-GREY-BACKGROUND-2023-trimmed.png" alt="Seven Stars Logo" width="200" style="margin-bottom: 20px;" />

# **Seven Stars CMS (Pub Club Content Management System)**

  <p>
    <b>A high-performance, custom-built, premium Content Management Dashboard</b><br>
    <i>Next.js 16 • React 19 • Prisma v6 • PostgreSQL • Supabase Storage • Auth.js v5 • Tailwind CSS v4</i>
  </p>

  <p>
    <strong>Live CMS Dashboard:</strong> <a href="https://cms-seven-star.vercel.app">https://cms-seven-star.vercel.app</a><br>
    <strong>Live Website:</strong> <a href="https://pub-club-mu.vercel.app/">https://pub-club-mu.vercel.app/</a>
  </p>

---

[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Node.js](https://img.shields.io/badge/Node.js-18.x+-blue.svg)]()
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)]()
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC.svg)]()
[![Prisma](https://img.shields.io/badge/Prisma-v6.19-5A67D8.svg)]()

</div>

<br />

Welcome to the **Seven Stars CMS** — an enterprise-grade, custom-tailored content management console designed specifically for the **Seven Stars Pub Club**. This system provides comprehensive control over page section layouts, dining & drink menus, navigation bar hierarchy, Supabase media assets, global SEO metadata, dynamic XML sitemaps, robots.txt rules, third-party analytics scripts, and customer enquiry CRM leads with automated SMTP email notifications.

---

## 📑 Table of Contents

- [✨ Core Features & Capabilities](#-core-features--capabilities)
- [🚀 Tech Stack & Architecture](#-tech-stack--architecture)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🔑 Environment Configuration Guide](#-environment-configuration-guide)
  - [Environment Variables Reference Table](#environment-variables-reference-table)
  - [Sanitized `.env` Template](#sanitized-env-template)
- [💻 Developer Quickstart & Setup](#-developer-quickstart--setup)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Installation](#2-installation)
  - [3. Environment Setup](#3-environment-setup)
  - [4. Database Migration & Client Generation](#4-database-migration--client-generation)
  - [5. Database Seeding & Admin Credentials](#5-database-seeding--admin-credentials)
  - [6. Running the Development Server](#6-running-the-development-server)
- [🗄️ Database Schema & Data Models](#️-database-schema--data-models)
- [🌐 CMS Page Builders & Layout Modules](#-cms-page-builders--layout-modules)
- [🔌 Comprehensive API Endpoints Matrix](#-comprehensive-api-endpoints-matrix)
- [⚡ API Caching & Revalidation Architecture](#-api-caching--revalidation-architecture)
- [🎨 Design Language & Aesthetic System](#-design-language--aesthetic-system)
- [🚀 Production Deployment Guide](#-production-deployment-guide)

---

## ✨ Core Features & Capabilities

The CMS bridges dynamic server-side content with the live customer-facing portal via optimized REST API endpoints, cached data fetching, and robust admin controls.

| Module | Feature Capabilities |
| :--- | :--- |
| **Dynamic Layout Builder** | Section-based visual reordering, content creation, and real-time updates for 12 static pages (Home, About Us, Dining, Menu, Events, Gallery, Our Story, Christmas, Contact Us, Blog, Privacy Policy, Terms of Service). |
| **Supabase Cloud Asset Manager** | Direct cloud bucket storage integration for high-resolution images, brand logos, and gallery media with client-side image compression and Next.js Sharp image transformation. |
| **Menu & Navigation Editor** | Drag-and-drop hierarchy controls for main navigation links, sub-menu items, footer shortcuts, dining food & drinks menus, cellar list, and social link integrations. |
| **Global SEO & Custom Scripts** | Complete real-time management for page meta titles, meta descriptions, target keywords, canonical URLs, OG Social share tags, dynamic `robots.txt`, dynamic XML `sitemap.xml`, Google Analytics (GA4), GTM, Google Search Console, and custom HTML header/footer code injection. |
| **Enquiry CRM & SMTP Mailer** | Interactive admin dashboard tracking customer booking requests, party enquiries, and lead form submissions, paired with instant HTML email dispatching to site administrators via Nodemailer SMTP. |
| **Blog Management System** | Complete CRUD operations for blog posts, featuring rich-text publishing, hero image management, publication dates, and author metadata. |
| **Metrics & System Health** | Real-time analytics overview featuring interactive charts (Recharts) for lead volume, active static pages, search index status, and PostgreSQL connection health. |
| **Secure Authentication** | Credential-based authentication powered by NextAuth.js v5 (Auth.js) with bcrypt password hashing and session encryption. |

---

## 🚀 Tech Stack & Architecture

- **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) paired with [React 19](https://react.dev/).
- **Database ORM**: [Prisma ORM v6](https://www.prisma.io/) managing a remote [PostgreSQL](https://www.postgresql.org/) database on Supabase (utilizing connection pooling via `pgbouncer` for high query throughput and direct connections for schema migrations).
- **Cloud Storage**: [Supabase Storage](https://supabase.com/storage) for storing and serving high-resolution media assets.
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) with custom CSS utility extensions and glassmorphism overlay styles.
- **Animations & Effects**: [Framer Motion v12](https://www.framer.com/motion/) for fluid motion transitions, modal reveals, and UI feedback.
- **Auth System**: [NextAuth.js v5](https://next-auth.js.org/) (Auth.js) credentials provider backed by `@auth/prisma-adapter` and `bcryptjs`.
- **Rich Text & Forms**: [React Quill New](https://www.npmjs.com/package/react-quill-new) rich-text editor integration and [React Hot Toast](https://react-hot-toast.com/) notifications.
- **Email Delivery**: [Nodemailer](https://nodemailer.com/) with custom HTML email template generation for instant lead delivery over SMTP.
- **Data Visualization**: [Recharts v3](https://recharts.org/) for rendering dashboard analytics.

---

## 📂 Project Directory Structure

```text
pub-club-cms/
├── prisma/                    # Database ORM configurations & seed scripts
│   ├── schema.prisma          # PostgreSQL models (Page, Section, NavLink, Enquiry, GlobalConfig, User)
│   └── seed.js                # Database seeder script with initial pages, sections & admin user
├── public/                    # Static public web assets, fallback icons, and static images
├── src/
│   ├── app/                   # Next.js 16 App Router pages & API routes
│   │   ├── api/               # Server-side REST API handlers (26 endpoint directories)
│   │   │   ├── about/         # About page API handler
│   │   │   ├── auth/          # NextAuth authentication endpoints
│   │   │   ├── blogs/         # Blog posts CRUD operations
│   │   │   ├── christmas/     # Christmas festive page API
│   │   │   ├── contact/       # Contact page section API
│   │   │   ├── dashboard/     # Analytics metrics & CRM counts API
│   │   │   ├── dining/        # Dining page section API
│   │   │   ├── enquiries/     # Contact lead submissions & SMTP dispatch API
│   │   │   ├── events/        # Events page section API
│   │   │   ├── gallery/       # Media gallery items API
│   │   │   ├── health/        # Database health check diagnostic API
│   │   │   ├── home/          # Homepage layout sections API
│   │   │   ├── instagram/     # Instagram feed auto-refresh API
│   │   │   ├── menu/          # Food & drink menu sections API
│   │   │   ├── nav-links/     # Navigation links & order hierarchy API
│   │   │   ├── our-story/     # Pub heritage timeline API
│   │   │   ├── pages/         # Dynamic page CRUD operations
│   │   │   ├── profile/       # Admin password & account settings API
│   │   │   ├── sections/      # Polymorphic layout sections engine API
│   │   │   ├── seo/           # Global SEO, sitemap.xml & robots.txt routes
│   │   │   └── upload/        # Supabase direct image upload handler
│   │   ├── components/        # Admin UI layouts (Sidebar, Header, RichText, Form controls)
│   │   ├── lib/               # Client-side cache engine (`apiCache.ts`), upload helpers & utils
│   │   ├── login/             # Credential login authentication screen
│   │   ├── navigation/        # Menu links and social media navigation editors
│   │   │   ├── menu-links/    # Main navigation links order builder
│   │   │   └── social-media/  # Social media links editor
│   │   ├── seo/               # Global SEO, Page Metadata, Sitemap & Robots configuration pages
│   │   │   ├── global/        # Global SEO & Header/Footer code injection
│   │   │   ├── pages/         # Per-page metadata editor
│   │   │   └── sitemap-robots/# Sitemap & robots.txt editor
│   │   ├── settings/          # Admin account password & profile management
│   │   ├── static-pages/      # Visual page section layout builders (12 static pages)
│   │   │   ├── about/         # About Us layout builder
│   │   │   ├── blog/          # Blog posts publisher
│   │   │   ├── christmas/     # Festive Christmas layout builder
│   │   │   ├── contact/       # Contact info layout builder
│   │   │   ├── dining/        # Culinary experience builder
│   │   │   ├── events/        # Private events layout builder
│   │   │   ├── gallery/       # Gallery photos manager
│   │   │   ├── home/          # Homepage section builder
│   │   │   ├── menu/          # Food, drinks & cellar menu builder
│   │   │   ├── our-story/     # Pub history timeline builder
│   │   │   ├── privacy-policy/# Legal Privacy policy builder
│   │   │   └── terms-of-service/# Legal Terms layout builder
│   │   └── submissions/       # Customer enquiry lead table CRM view
│   │       └── enquiries/     # Submissions CRM table
│   ├── components/            # Shared universal components (FooterCMS, UI components)
│   ├── lib/                   # Core server instances (Prisma database client, Supabase client, SMTP mailer)
│   └── styles/                # Global CSS rules, Tailwind v4 imports, Quill editor overrides
├── .env.example               # Sanitized environment variable configuration template
├── .gitignore                 # Git ignore rules (with !.env.example exception)
├── next.config.ts             # Next.js compilation settings & remote image domains
├── package.json               # Package dependencies & npm execution scripts
├── prisma.config.ts           # Prisma configuration entrypoint
└── tsconfig.json              # TypeScript compilation rules
```

---

## 🔑 Environment Configuration Guide

To protect system security and credentials, **never commit real API secrets, database passwords, or SMTP keys to git**. Environment variables are maintained in local `.env` or `.env.local` files and loaded at runtime.

### Environment Variables Reference Table

Below is the complete reference of all environment variables used by the CMS, including field name, requirement level, purpose, and value format instructions:

| Field Name | Status | Category | Written Description & Required Value Format |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Required** | Database | PostgreSQL connection URL with connection pooling (`pgbouncer`) enabled (typically port `6543`). Used by Prisma Client for querying database records.<br>_Format:_ `postgresql://<user>:<password>@<db-host>:6543/<db-name>?pgbouncer=true` |
| `DIRECT_URL` | **Required** | Database | Direct PostgreSQL database connection URL bypassing `pgbouncer` (typically port `5432`). Used by Prisma CLI for running migrations and `npx prisma db push`.<br>_Format:_ `postgresql://<user>:<password>@<db-host>:5432/<db-name>` |
| `NEXT_PUBLIC_SUPABASE_URL` | **Required** | Storage | Project URL of your Supabase instance. Used client-side and server-side to construct media asset bucket URLs.<br>_Format:_ `https://<your-supabase-project-id>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Required** | Storage | Public anonymous API key for your Supabase project. Required for client-side image uploads to Supabase Storage.<br>_Format:_ `eyJhbGciOi...` (Supabase anonymous API key string) |
| `AUTH_SECRET` | **Required** | Security | Cryptographic secret key used by Auth.js / NextAuth.js v5 to encrypt cookies, session tokens, and JWT tokens.<br>_Format:_ 32+ character random base64 string (generate using `openssl rand -base64 32`) |
| `NEXTAUTH_SECRET` | **Required** | Security | Fallback cryptographic session secret key for NextAuth.js (set to the exact same value as `AUTH_SECRET`).<br>_Format:_ 32+ character random string |
| `NEXTAUTH_URL` | **Required** | Security | Canonical base URL where the CMS application is hosted. Essential for authentication callback redirects and cookie scoping.<br>_Format:_ `http://localhost:3001` (development) or `https://cms.yourdomain.com` (production) |
| `ALLOWED_ORIGINS` | Optional | CORS | Comma-separated list of web domain origins permitted to make cross-origin requests to API endpoints. Defaults to `*` if unspecified.<br>_Format:_ `https://your-public-website.com,http://localhost:3000` or `*` |
| `NEXT_PUBLIC_WEBSITE_URL` | **Required** | SEO / Routing | Base URL of the public customer-facing website. Used by the CMS SEO section to generate canonical URLs, dynamic XML `sitemap.xml`, and `robots.txt`.<br>_Format:_ `https://www.sevenstarsatmarshbaldon.co.uk` or `http://localhost:3000` |
| `SMTP_HOST` | Optional | Mailer | Hostname of your SMTP outbound mail server used by Nodemailer to dispatch enquiry notifications.<br>_Format:_ `smtp.gmail.com`, `smtppro.zoho.com`, `smtp.sendgrid.net`, or custom mail server |
| `SMTP_PORT` | Optional | Mailer | Port number for the SMTP server. Defaults to `465` if unspecified.<br>_Format:_ `465` (for SSL/TLS) or `587` (for STARTTLS) |
| `SMTP_SECURE` | Optional | Mailer | Boolean flag (`true` or `false`) indicating if SSL/TLS encryption should be established on connection. Automatically active for port `465`.<br>_Format:_ `true` or `false` |
| `SMTP_USER` | Optional | Mailer | Authentication username or email address for logging into the SMTP server.<br>_Format:_ `your-email@yourdomain.com` or SMTP username |
| `SMTP_PASS` | Optional | Mailer | Password or App-Specific Password for authenticating the `SMTP_USER`.<br>_Format:_ Secret application password string |
| `SMTP_FROM_EMAIL` | Optional | Mailer | Email address that appears in the `From` field of sent notification emails. Defaults to `SMTP_USER` if omitted.<br>_Format:_ `notifications@yourdomain.com` |
| `SMTP_FROM_NAME` | Optional | Mailer | Human-readable sender name attached to outbound notification emails.<br>_Format:_ `Seven Stars Pub & Club` |
| `SMTP_FROM` | Optional | Mailer | Full custom sender format string. Overrides both `SMTP_FROM_NAME` and `SMTP_FROM_EMAIL` if provided.<br>_Format:_ `"Seven Stars Admin" <notifications@yourdomain.com>` |
| `CONTACT_EMAIL` | Optional | Mailer | Primary target email address that receives website customer enquiry submissions.<br>_Format:_ `info@sevenstarsatmb.co.uk` |

---

### Sanitized `.env` Template

Create a `.env` file at the root of your project directory (`pub-club-cms/.env`) and populate it using the sanitized template below:

```env
# =========================================================================
# Database Connections (Supabase / PostgreSQL)
# =========================================================================
DATABASE_URL="postgresql://<db_user>:<db_password>@<db_host>:6543/<db_name>?pgbouncer=true"
DIRECT_URL="postgresql://<db_user>:<db_password>@<db_host>:5432/<db_name>"

# =========================================================================
# Supabase Storage Credentials (Media Asset Uploads)
# =========================================================================
NEXT_PUBLIC_SUPABASE_URL="https://<your-project-id>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-supabase-anon-public-key>"

# =========================================================================
# Authentication & Encryption Secrets (NextAuth.js v5 / Auth.js)
# =========================================================================
AUTH_SECRET="<your-generated-32-char-random-secret-key>"
NEXTAUTH_SECRET="<your-generated-32-char-random-secret-key>"
NEXTAUTH_URL="http://localhost:3001"

# =========================================================================
# Application & Frontend Website URLs
# =========================================================================
ALLOWED_ORIGINS="*"
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"

# =========================================================================
# SMTP Email Server Settings (Enquiry Form Submissions)
# =========================================================================
SMTP_HOST="<smtp-server-hostname>"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="<your-smtp-username-or-email>"
SMTP_PASS="<your-smtp-password-or-app-key>"
SMTP_FROM_EMAIL="<sender-email-address>"
SMTP_FROM_NAME="Seven Stars Pub & Club"
CONTACT_EMAIL="<recipient-enquiry-email-address>"
```

> [!TIP]
> To generate a secure random value for `AUTH_SECRET` and `NEXTAUTH_SECRET`, run:
> ```bash
> openssl rand -base64 32
> ```

---

## 💻 Developer Quickstart & Setup

Follow these step-by-step instructions to initialize and run the CMS application in a local development environment.

### 1. Prerequisites

Ensure your development workstation has the following installed:
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9.x or higher (or `yarn` / `pnpm`)
- **PostgreSQL Database**: A running local PostgreSQL server or a remote Supabase project.

### 2. Installation

Clone the repository and install all npm dependencies:

```bash
# Navigate to the CMS project root
cd pub-club-cms

# Install package dependencies
npm install
```

### 3. Environment Setup

Copy `.env.example` to create your local `.env` configuration file:

```bash
cp .env.example .env
```

Open `.env` in your code editor and populate each variable with your database, Supabase, NextAuth, and SMTP credentials as described in the [Environment Configuration Guide](#-environment-configuration-guide).

### 4. Database Migration & Client Generation

Push the database models defined in `prisma/schema.prisma` to your target PostgreSQL database and generate the Prisma Client types:

```bash
# Push schema structure to PostgreSQL
npx prisma db push

# Generate Prisma Client typescript bindings
npx prisma generate
```

### 5. Database Seeding & Admin Credentials

Run the automated seeder script to populate initial static pages, navigation menus, and the default administrative user account:

```bash
# Seed database tables and initialize admin account
npm run seed
```

Default administrative login credentials created by the seeder:
- **Email**: `admin@sevenstars.co.uk`
- **Password**: `1234asdf@` *(Change immediately upon logging in under Settings)*

### 6. Running the Development Server

Start the Next.js local development server:

```bash
npm run dev
```

Once started, open your web browser and navigate to:
**`http://localhost:3001`** (or the custom port configured in `NEXTAUTH_URL`).

Log in using the administrative credentials from Step 5.

---

## 🗄️ Database Schema & Data Models

The CMS database is managed via Prisma ORM and consists of six core models:

1. **`User`**: Admin user authentication accounts storing hashed passwords (`bcryptjs`), names, and email addresses.
2. **`Page`**: Represents individual website pages (`slug`, `title`, `order`, `visibility`, `isStatic`, `metaTitle`, `metaDescription`, `targetKeywords`, `canonicalUrl`, `noIndex`, `featuredImage`, `ogTitle`, `ogDescription`, `ogImage`, `schema`).
3. **`Section`**: Polymorphic layout blocks associated with a `Page` via foreign key (`pageId`). Contains `type`, `order`, and a dynamic `content` JSON column.
4. **`NavLink`**: Navigation menu hierarchy storing top-level links, dropdown sub-links, footer links (`label`, `url`, `type`, `parent`, `order`, `description`, `title`, `isStatic`).
5. **`Enquiry`**: Stores incoming customer contact form submissions, party enquiries, and lead data (`name`, `email`, `interestedIn`, `budget`, `projectGoals`, `createdAt`).
6. **`GlobalConfig`**: Single-row configuration storing global website metadata (`siteTitle`, `siteDescription`, `favicon`, `googleAnalyticsId`, `gtmId`, `searchConsoleId`, `customHeaderScripts`, `customFooterScripts`, `socialLinks`, `sitemapEnabled`, `robotsTxt`, `schema`).

---

## 🌐 CMS Page Builders & Layout Modules

The CMS provides specialized visual editor interfaces located under `src/app/static-pages/`:

| Page Route | Builder Focus | Content Managed |
| :--- | :--- | :--- |
| `/static-pages/home` | Homepage Builder | Hero section, Feature tiles, Gallery showcase, Visitor popup banner, Visiting info. |
| `/static-pages/about` | About Us Builder | Heritage introduction, Pub philosophy, Team spotlight, Facility feature highlights. |
| `/static-pages/dining` | Dining Builder | Culinary experience overview, Seasonal food highlights, Private dining room info. |
| `/static-pages/menu` | Menus & Cellar | Food menu categories, Drink lists, Wine cellar selections, Special curated menus. |
| `/static-pages/events` | Private Events | Function room bookings, Event package details, Private gathering features. |
| `/static-pages/gallery` | Photo Gallery | High-res image uploads, Category tagging (Atmosphere, Dining, Events, Garden). |
| `/static-pages/our-story` | History & Story | Pub timeline events, Historical milestones, Heritage photo showcase. |
| `/static-pages/christmas` | Festive / Christmas | Seasonal festive dining packages, Christmas menu offerings, Party booking info. |
| `/static-pages/contact` | Contact & Venue | Operating hours, Location address details, Parking & directions guide. |
| `/static-pages/blog` | Blog Publisher | Create, edit, and publish news articles, summer events, and pub updates. |
| `/static-pages/privacy-policy` | Legal Privacy | Privacy policy text content and data handling disclosures. |
| `/static-pages/terms-of-service` | Legal Terms | Terms of service and pub reservation policy disclosures. |

---

## 🔌 Comprehensive API Endpoints Matrix

The CMS exposes server-side REST API handlers located under `src/app/api/`:

| API Endpoint Path | Supported Methods | Description & Functionality |
| :--- | :--- | :--- |
| `/api/auth/[...nextauth]` | `GET`, `POST` | NextAuth.js authentication session management & credential login. |
| `/api/dashboard` | `GET` | Fetches dashboard metrics, total CRM leads count, page counts, and activity stats. |
| `/api/sections` | `GET`, `PUT` | Fetches or updates polymorphic layout sections for dynamic pages. |
| `/api/pages` | `GET`, `POST`, `PUT`, `DELETE` | CRUD operations for managing site pages and metadata. |
| `/api/nav-links` | `GET`, `POST`, `PUT`, `DELETE` | Retrieves and updates navigation bar menu links and ordering. |
| `/api/enquiries` | `GET`, `POST`, `DELETE` | Saves incoming customer enquiries and dispatches Nodemailer SMTP emails. |
| `/api/blogs` | `GET`, `POST`, `PUT`, `DELETE` | CRUD operations for blog posts and article publishing. |
| `/api/seo` | `GET`, `PUT` | Fetches and updates global SEO settings, header/footer scripts, and tracking IDs. |
| `/api/seo/sitemap` | `GET` | Generates dynamic XML `sitemap.xml` for search engines. |
| `/api/seo/robots` | `GET` | Generates dynamic `robots.txt` output based on GlobalConfig rules. |
| `/api/upload` | `POST` | Uploads image files directly to Supabase Storage bucket. |
| `/api/health` | `GET` | Diagnostic health endpoint verifying database connectivity. |
| `/api/profile` | `PUT` | Updates administrator account profile name and password hash. |

---

## ⚡ API Caching & Revalidation Architecture

To deliver instant admin navigation and reduce unnecessary database query load, the CMS features an in-memory client-side cache utility located in [`src/app/lib/apiCache.ts`](file:///Users/sudeeshkumar/Desktop/TGT%20COMPANY/pub-club-cms/src/app/lib/apiCache.ts).

### Usage Guidelines

1. **Fetching Cached Data**:
   Use `fetchWithCache(url)` instead of raw `fetch()` calls when requesting content endpoints that change infrequently (e.g. navigation links, dynamic sections, global config):
   ```typescript
   import { fetchWithCache } from "@/app/lib/apiCache";

   // Fetches data from cache if fresh, otherwise retrieves from network
   const data = await fetchWithCache("/api/sections");
   ```

2. **Invalidating Stale Entries (Revalidation)**:
   Whenever performing write operations (`POST`, `PUT`, `DELETE`), **you must explicitly clear the associated cache key** so the user interface immediately reflects the latest database state:
   ```typescript
   import { clearCache } from "@/app/lib/apiCache";

   // Save changes to database
   await fetch("/api/sections", { method: "PUT", body: JSON.stringify(payload) });

   // Invalidate stale client cache entry
   clearCache("/api/sections");
   ```

---

## 🎨 Design Language & Aesthetic System

The CMS UI follows a high-contrast dark aesthetic tailored specifically to match the **Seven Stars Pub & Club** brand identity:

- **Deep Navy & Slate (`#0A0F29` / `#020617`)**: Base background shades establishing visual depth.
- **Royal Gold (`#D4AF37`)**: Reserved strictly for high-priority interactive elements, highlight borders, active state indicators, section headers, and primary CTA buttons.
- **Glassmorphism**: Modals, sidebar menus, navigation bars, and stats cards utilize `backdrop-blur-md` with semi-transparent dark borders (`border-white/10`).
- **Smooth Animations**: Framer Motion components provide subtle entrance animations (`opacity`, `y-axis shift`) and interactive hover feedback without compromising dashboard responsiveness.

---

## 🚀 Production Deployment Guide

When deploying the CMS to production platforms (such as Vercel or custom Linux servers):

1. **Environment Variables**: Set all 18 environment variables in your hosting provider's settings dashboard (Vercel Environment Variables).
2. **Build Command**: Configure the build script to run Prisma generation:
   ```bash
   npm run build
   ```
3. **Database Migrations**: Ensure `DATABASE_URL` uses the `pgbouncer` pooler string (port 6543) for runtime queries, and `DIRECT_URL` points directly to PostgreSQL (port 5432) for running migrations.

---

<p align="center">
  <b>© 2026 Seven Stars Pub & Club</b><br>
  Private & Confidential Proprietary Software.
</p>

