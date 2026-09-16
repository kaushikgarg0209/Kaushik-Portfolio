# Portfolio + Admin Panel

A professional developer portfolio with a password-protected admin panel. Built with Next.js, PostgreSQL, and Vercel storage.

## Features

- **Public Portfolio**: Dark tech aesthetic with terminal boot sequence, 3D hero, Framer Motion animations
- **Admin Panel**: Full CRUD for profile, skills, projects, experience, education, certifications, testimonials, stats
- **Dynamic Content**: Update portfolio from admin — changes appear instantly via ISR revalidation
- **File Uploads**: Profile photos, project images, resume PDF via Vercel Blob
- **Contact Form**: Messages stored in DB + optional email via Resend

## Tech Stack

- Next.js 16 (App Router)
- TypeScript, Tailwind CSS v4
- Drizzle ORM + Vercel Postgres
- NextAuth.js (credentials)
- Framer Motion, React Three Fiber
- Vercel Blob storage

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

### 3. Database setup

Connect Vercel Postgres (or any PostgreSQL) and set `POSTGRES_URL`, then:

```bash
npm run db:push    # Create tables
npm run db:seed    # Seed placeholder data + admin user
```

### 4. Run locally

```bash
npm run dev
```

- Portfolio: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Default admin (after seed): `admin@example.com` / value of `ADMIN_PASSWORD`

## Deploy to Vercel

1. Push to GitHub and import in Vercel
2. Add **Vercel Postgres** storage integration
3. Add **Vercel Blob** storage integration
4. Set env vars: `AUTH_SECRET`, `AUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
5. Deploy, then run `npm run db:push` and `npm run db:seed` via Vercel CLI or one-time script
6. Visit `/admin/login` and add your real content

## Admin Pages

| Route | Purpose |
|-------|---------|
| `/admin/login` | Sign in |
| `/admin/dashboard` | Overview |
| `/admin/profile` | Hero, bio, photo, resume, social links |
| `/admin/skills` | Skills CRUD |
| `/admin/projects` | Projects CRUD |
| `/admin/experience` | Work history |
| `/admin/education` | Education |
| `/admin/certifications` | Certifications |
| `/admin/testimonials` | Testimonials |
| `/admin/stats` | Homepage counters |
| `/admin/messages` | Contact inbox |
| `/admin/settings` | Site config + password change |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed initial data |
| `npm run db:generate` | Generate migrations |
