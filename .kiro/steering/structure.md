# Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard tabs (ReportsTab, EventsTab, etc.)
│   ├── auth/           # Auth components (ProtectedRoute)
│   ├── layout/         # Layout components (Layout, Header, Footer)
│   ├── report/         # Report form components
│   └── ui/             # shadcn/ui components (button, card, dialog, etc.)
├── hooks/
│   ├── useAuth.tsx     # Auth context and hook (Supabase auth)
│   ├── useTheme.tsx    # Theme context (dark/light mode)
│   ├── useSystemSettings.tsx  # System-wide settings
│   └── use-*.ts        # Other utility hooks
├── integrations/
│   └── supabase/       # Supabase client and generated types
├── lib/
│   └── utils.ts        # Utility functions (cn helper)
├── pages/              # Route page components
│   ├── Index.tsx       # Home page (shows admin panel for admins)
│   ├── Admin.tsx       # Admin dashboard
│   ├── Auth.tsx        # Login/signup
│   ├── Vote.tsx        # Election voting
│   └── *.tsx           # Other public pages
├── App.tsx             # Root component with providers and routes
├── main.tsx            # Entry point
└── index.css           # Global styles and CSS variables

public/                 # Static assets
supabase/
├── config.toml         # Supabase local config
└── migrations/         # Database migrations
```

## Key Patterns

### Component Organization
- UI primitives in `components/ui/` (shadcn pattern)
- Feature components grouped by domain (admin/, auth/, report/)
- Pages are route-level components in `pages/`

### Provider Hierarchy (App.tsx)
```
QueryClientProvider → ThemeProvider → AuthProvider → SystemSettingsProvider → TooltipProvider
```

### Protected Routes
Use `<ProtectedRoute requireAdmin>` wrapper for admin-only pages.

### Styling Convention
- Use `cn()` utility for conditional class merging
- Tailwind classes with CSS variable-based theming
- Custom color tokens: primary, forest, gold, cream, alert
