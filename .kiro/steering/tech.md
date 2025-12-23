# Tech Stack

## Core Framework
- React 18 with TypeScript
- Vite (build tool, dev server on port 8080)
- React Router DOM v6 for routing

## UI & Styling
- Tailwind CSS with custom theme configuration
- shadcn/ui component library (Radix UI primitives)
- class-variance-authority (CVA) for component variants
- tailwind-merge + clsx via `cn()` utility
- Custom CSS variables for theming (light/dark modes)
- Fonts: Inter (body), Poppins (display)

## State & Data
- TanStack React Query for server state
- Supabase for backend (auth, database, storage)
- React Hook Form + Zod for form handling/validation
- React Context for auth, theme, and system settings

## Additional Libraries
- Lucide React (icons)
- date-fns (date formatting)
- Recharts (charts/graphs)
- Sonner + Radix Toast (notifications)
- Embla Carousel

## Common Commands
```bash
# Development
npm run dev          # Start dev server (localhost:8080)

# Build
npm run build        # Production build
npm run build:dev    # Development build

# Quality
npm run lint         # ESLint check
npm run preview      # Preview production build
```

## Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key

## Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig and vite)
