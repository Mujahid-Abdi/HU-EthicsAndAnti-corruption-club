# Updated Tech Stack

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

## Backend & Data (UPDATED)
- **Firebase Authentication** for user management
- **Firestore Database** for NoSQL data storage
- **Firebase Storage** for file uploads
- **Firebase Security Rules** for data access control
- TanStack React Query for client-side state management
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

# Firebase (optional)
firebase login       # Login to Firebase CLI
firebase deploy      # Deploy to Firebase Hosting
```

## Environment Variables (UPDATED)
Required in `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig and vite)

## Migration Changes

### What Changed:
- ✅ **Supabase** → **Firebase** (complete migration)
- ✅ **PostgreSQL** → **Firestore NoSQL**
- ✅ **Supabase Auth** → **Firebase Auth**
- ✅ **Supabase Storage** → **Firebase Storage**
- ✅ **RLS Policies** → **Firestore Security Rules**

### New File Structure:
```
src/
├── lib/
│   ├── firebase.ts         # Firebase configuration
│   ├── firestore.ts        # Firestore service utilities
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript interfaces
├── hooks/
│   ├── useAuth.tsx         # Firebase Auth context
│   ├── useTheme.tsx        # Theme context
│   └── useSystemSettings.tsx # System settings with Firestore
└── components/             # React components (unchanged structure)
```

### Benefits of Firebase:
- **Better Offline Support**: Automatic offline caching
- **Real-time Updates**: Built-in real-time listeners
- **Scalability**: Google Cloud infrastructure
- **Security**: Robust security rules system
- **Integration**: Seamless Google services integration
- **Analytics**: Built-in Firebase Analytics
- **Performance**: Optimized for mobile and web

### Development Workflow:
1. Set up Firebase project (see FIREBASE_SETUP_GUIDE.md)
2. Configure environment variables
3. Run `npm run dev` to start development
4. Use Firebase Console for database management
5. Deploy with `firebase deploy` (optional)