<div align="center">
  <img src="https://sevenstarsatmarshbaldon.co.uk/wp-content/uploads/2023/06/FINAL-SEVEN-STARS-GREY-BACKGROUND-2023-trimmed.png" alt="Seven Stars Logo" width="200" style="margin-bottom: 20px;" />

# **Seven Stars CMS (Pub Club Content Management System)**

  <p>
    <b>A high-performance, custom-built, premium Content Management Dashboard</b><br>
    <i>Next.js 16 • React 19 • Prisma • PostgreSQL • Tailwind CSS v4 • Supabase</i>
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

Welcome to the **Seven Stars CMS** — a dedicated, custom-tailored management console built from the ground up to securely and dynamically control the Seven Stars Pub Club digital footprint. This centralized portal offers a seamless, performant, and premium UI to manage menus, event galleries, page structures, global SEO configs, and client enquiries.

---

## 📑 Table of Contents

- [Core Principles & Features](#-core-principles--features)
- [System Architecture & Stack](#-system-architecture--stack)
- [Folder Structure](#-folder-structure)
- [Developer Setup](#-developer-setup)
- [Environment Configurations](#-environment-configurations)
- [Caching & Cache Invalidation](#-caching--cache-invalidation)
- [Design Language](#-design-language)

---

## ✨ Core Principles & Features

The CMS bridges the gap between static page generation and dynamic, database-driven contents by exposing real-time API integrations backed by a performance caching strategy.

| Feature Area | Capabilities |
| :--- | :--- |
| **Modular Page Control** | Section-based layout editing for Home, About, Dining, Events, Our Story, and static pages. |
| **Asset Manager** | Integrated Supabase Bucket storage handling modern image resizing and direct client-side uploads. |
| **Menu & Navigation Editor** | Drag-order structure controls for main navigation links and dining menus. |
| **Global SEO & Custom Scripts** | Real-time robots.txt, sitemaps configuration, custom headers/footers injection, schema JSON-LD, and metadata customization per-page. |
| **CRM Enquiry Dashboard** | Unified dashboard tracing direct lead forms, customer submissions, and contact metrics. |
| **Metrics & Health** | Dynamic dashboard home featuring interactive charts tracking submissions and website configuration stats. |

---

## 🚀 System Architecture & Stack

Built for Speed, Security, and Seamless Content Control:

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router) running on [React 19](https://react.dev/).
- **Database Engine**: [PostgreSQL] (Supabase hosted) managed strictly via [Prisma ORM v6](https://www.prisma.io/). Supported by connection pooling (`pgbouncer`) for high performance and direct connections for fast migrations.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) combined with [Framer Motion v12](https://www.framer.com/motion/) for fluid animations.
- **State & Inputs**: [React Hot Toast](https://react-hot-toast.com/) alerts, modular state hooks, custom file upload helpers, and rich-text area fields styled via [React Quill New](https://www.npmjs.com/package/react-quill-new).
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org/) (Auth.js) credentials provider using `@auth/prisma-adapter` and `bcryptjs` hashing.

---

## 📂 Folder Structure

The repository is modularly segmented for maximum component reuse:

```text
pub-club-cms/
├── prisma/                    # Database models, Prisma client configuration, and schema
│   └── schema.prisma          # PostgreSQL models definition
├── public/                    # Root static assets, icons, and system configurations
├── src/
│   ├── app/                   # Next.js 16 App Router
│   │   ├── api/               # API endpoints (GET, POST, PUT, DELETE)
│   │   ├── components/        # Layout and dashboard components (Sidebar, AdminHeader, fields, etc.)
│   │   ├── lib/               # App-level utilities (apiCache, uploadHelpers, utils)
│   │   ├── login/             # Credential login route
│   │   ├── navigation/        # Menu links and social media editors
│   │   ├── seo/               # SEO, Sitemap, Robots config pages
│   │   ├── settings/          # Password and Profile settings
│   │   └── static-pages/      # Dynamic section builders (Home, About, Dining, Events, etc.)
│   │   └── submissions/       # Enquiry CRM database view
│   ├── components/            # Universal components (e.g. FooterCMS)
│   ├── lib/                   # Database instance helper (prisma, supabase clients)
│   └── styles/                # Styles sheets (global layouts, quill-custom overrides)
├── scripts/                   # Utility and management scripts
│   └── create-user.js         # Command-line helper to create initial admin users
├── .env                       # Local secrets (Database URLs, API credentials)
├── eslint.config.mjs          # Linting settings
├── next.config.ts             # Application compilation configurations
├── package.json               # Dependecy versions and control scripts
└── tsconfig.json              # TypeScript compilation rules
```

---

## 💻 Developer Setup

Follow the steps below to initialize and serve the CMS locally on your machine.

### 1. Requirements

Ensure the target machine has the following dependencies initialized in the global environment:
- **Node.js** (v18.0.0 or later, v20+ recommended)
- **npm** or **Yarn** package manager
- **PostgreSQL** database (or a Supabase Database URL)

### 2. Install Dependencies

Clone this repository locally, navigate into the directory, and install the modules:

```bash
git clone <repository-url>
cd pub-club-cms
npm install
```

### 3. Setup Environment variables

Create a `.env` file (or `.env.local` for development environments) at the root of the project. See the [Environment Configurations](#-environment-configurations) section below.

### 4. Database Syncing & Schema Generation

Synchronize the Prisma models and generate the types for client execution:

```bash
# Push database schemas
npx prisma db push

# Generate the prisma client
npx prisma generate
```

### 5. Create Initial Admin User

Since the CMS does not feature public registration, you must create your first administrative credentials manually. Use the provided command-line helper:

```bash
# Usage: node scripts/create-user.js <email> <password> [name]
node scripts/create-user.js admin@example.com mysecurepassword "Admin Name"
```

### 6. Start Development Server

Run the development command to boot the local server:

```bash
npm run dev
```

The CMS will now be accessible at `http://localhost:3001` (or the configured `NEXTAUTH_URL` port).

---

## 🔑 Environment Configurations

Below are the primary environment variables required to run the CMS. Add these to your local `.env` configuration file:

```env
# Database Connections
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<db_name>?pgbouncer=true&schema=public"
DIRECT_URL="postgresql://<user>:<password>@<host>:<port>/<db_name>"

# Supabase Storage Configuration (Assets / Uploads)
NEXT_PUBLIC_SUPABASE_URL="https://your-supabase-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-api-key"

# Auth.js / NextAuth Session Keys
AUTH_SECRET="your-generated-auth-secret-key"
NEXTAUTH_SECRET="your-generated-auth-secret-key"
NEXTAUTH_URL="http://localhost:3001"

# API CORS Configurations
ALLOWED_ORIGINS="*"

# Public Client Website URL
NEXT_PUBLIC_WEBSITE_URL="https://pub-club-mu.vercel.app"
```

> [!TIP]
> You can generate a secure random value for your `AUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

---

## ⚡ Caching & Cache Invalidation

To maintain optimal load speeds and reduce database reads, the CMS implements a lightweight client-side cache utility located in [apiCache.ts](file:///Users/sudeeshkumar/Desktop/TGT%20COMPANY/pub-club-cms/src/app/lib/apiCache.ts).

### How to use:
- **Fetching Cached Data**: Use `fetchWithCache(url)` instead of standard `fetch` when pulling records that change infrequently:
  ```typescript
  import { fetchWithCache } from "@/app/lib/apiCache";
  
  const data = await fetchWithCache("/api/sections");
  ```
- **Invalidating Stale Entries**: **CRITICAL** - Whenever executing standard mutating operations (`POST`, `PUT`, `DELETE`), you must explicitly clear the caching key to ensure the UI updates on the next page view:
  ```typescript
  import { clearCache } from "@/app/lib/apiCache";
  
  // Clear cached page data after update
  clearCache("/api/sections");
  ```

---

## 🎨 Design Language

Do not stray from the core styling guidelines of Seven Stars. The application relies entirely on maintaining a high-fidelity "premium pub" visual aesthetic:

- **Deep Dark Palette (`#0A0F29` / `#020617`)**: Utilize dark blues and slate shades for page depth.
- **The Gold Accent (`#D4AF37`)**: Explicitly reserved for highlight boundaries, primary interactive states, icons, and CTA rings. *Avoid overuse to maintain a clean, elegant style.*
- **Glassmorphism Overlay**: Modals, sidebar menus, and dashboard cards should leverage clean `backdrop-blur-md` coupled with semi-transparent borders.
- **Transitions**: Keep Framer Motion animation configurations light and fast (e.g. spring transitions with standard damping of `20-25` or subtle ease fades) so the dashboard feels highly responsive.

---

<p align="center">
  <b>© 2026 Seven Stars Pub Club</b><br>
  Strictly Private and Confidential Codebase.
</p>
