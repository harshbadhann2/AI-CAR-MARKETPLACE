
# AI-CAR-MARKETPLACE

Full-stack AI Car Marketplace built with Next.js, Tailwind CSS, Prisma, and Cloudinary/AI integrations. This repository contains a feature-complete starter with admin and user areas, test-drive flows, reservations, and example integrations for authentication and AI features.

## Short description

AI-CAR-MARKETPLACE is a marketplace for listing, discovering, and reserving cars. It includes:

- A public storefront with listings, filters, and detailed car pages (with an EMI calculator)
- Authenticated user flows for onboarding, saved cars, reservations, and test drives
- An admin console for managing cars, settings, and test-drive requests
- Example integrations for image hosting and AI features

## Highlights

- Next.js App Router with nested layouts and route groups
- Prisma schema and seed script for local DB setup
- Tailwind CSS + component primitives under `components/ui/`
- Organized `app/` routes: admin, auth, main site

## Project structure (high level)

- `app/` — Next.js routes, layouts, and pages
  - `app/(admin)/` — Admin panel and sub-pages
  - `app/(auth)/` — Authentication routes
  - `app/(main)/` — Main site pages (cars, profile, reservations)
- `components/` — Reusable UI components and `ui/` primitives
- `lib/` — Helpers and integrations (`arcjet.js`, `cloudinary.js`, `prisma.js`, etc.)
- `actions/` — Server actions used by forms and API routes
- `hooks/` — Client hooks like `use-fetch.js`
- `prisma/` — `schema.prisma` and `seed.js` for DB schema and seeding
- `public/` — Static assets (images, logos)
- `playwright-report/`, `tests/` — Test artifacts and screenshots

Key files:

- [app/layout.js](app/layout.js) — Root layout
- [app/page.js](app/page.js) — Homepage
- [app/(main)/cars/page.jsx](app/(main)/cars/page.jsx) — Listing page
- [app/(admin)/admin/page.jsx](app/(admin)/admin/page.jsx) — Admin dashboard
- [prisma/schema.prisma](prisma/schema.prisma) — DB schema
- [prisma/seed.js](prisma/seed.js) — Seed script
- [lib/prisma.js](lib/prisma.js) — Prisma client helper

## Environment variables

Create a `.env` file in the project root with these variables (examples):

```
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=
ARCJET_KEY=
```

If you use SQLite for development, you can set:

```
DATABASE_URL="file:./dev.db"
```

## Setup & run (development)

1. Install dependencies

```bash
npm install
```

2. Run Prisma migrations & seed

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

3. Start dev server

```bash
npm run dev
```

Open http://localhost:3000

## Useful scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npx prisma migrate dev` — Run DB migrations

## Deployment

Recommended: Vercel. Configure environment variables in Vercel dashboard and use `npm run build` as the build command.

## Tests

Playwright reports and screenshots are located in `playwright-report/`. Add or run tests per the existing test config in `package.json` if present.

## Next steps I can help with

- Create `.env.example` with the variables above
- Add `LICENSE` and `CONTRIBUTING.md`
- Configure a GitHub Action or Vercel deployment pipeline

If you'd like any of the above, tell me which and I'll add them.
