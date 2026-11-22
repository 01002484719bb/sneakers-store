# Khatwa — Sneakers Store (خطوة)

An Arabic-first e-commerce storefront for sneakers, built with React and backed by Supabase.

**Live demo:** https://sneakers-store-lilac.vercel.app

## Features

- Product catalog with 3D product views (model-viewer)
- Supabase backend for products and store data, with an admin area
- Localized Arabic (RTL) storefront
- Responsive design with Tailwind CSS

## Tech stack

- React 19 + Vite
- Tailwind CSS
- Supabase (database & backend)
- @google/model-viewer, lucide-react

## Run locally

```sh
npm install
```

Copy `.env.example` to `.env.local` and set your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_ADMIN_EMAIL=admin@example.com
```

Then:

```sh
npm run dev
```

`npm run build` creates a production build. On Vercel, add the same three environment variables under **Settings > Environment Variables** and redeploy.
