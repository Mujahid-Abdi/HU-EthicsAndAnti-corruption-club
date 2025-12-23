# Design Document

## Overview

This design implements a comprehensive role-based access control (RBAC) system with four distinct user roles and a complete news management feature for the Haramaya University Ethics and Anti-Corruption Club application. The system extends the existing two-role structure (admin, member) to include active_member and executive roles, each with tailored dashboards and permissions. The news management system allows admins to create, edit, publish, and manage news articles with rich content support.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Auth       │  │   Theme      │  │   System     │     │
│  │   Provider   │  │   Provider   │  │   Settings   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
├─────────────────────────────────────────────────────────────┤
│                    Routing Layer                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  RoleBasedRoute (Enhanced ProtectedRoute)            │  │
│  │  - Checks authentication                              │  │
│  │  - Validates user role                                │  │
│  │  - Redirects to role-specific dashboard              │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Page Components                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Admin   │ │  Active  │ │Executive │ │  Member  │     │
│  │Dashboard │ │  Member  │ │Dashboard │ │Dashboard │     │
│  │          │ │Dashboard │ │          │ │          │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              News Pages                               │  │
│  │  - News List (Public)                                 │  │
│  │  - News Detail (Public)                               │  │
│  │  - News Management (Admin Only)                       │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Query + Supabase Client                        │  │
│  │  - User role queries                                  │  │
│  │  - News CRUD operations                               │  │
│  │  - Dashboard data fetching                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
├─────────────────────────────────────────────────────────────┤
│  Database Tables:                                            │
│  - user_roles (extended enum)                                │
│  - profiles                                                  │
│  - news (enhanced with author, featured image)               │
│  - events, resources, reports (existing)                     │
│                                                              │
│  RLS Policies:                                               │
│  - Role-based access control                                 │
│  - News article permissions                                  │
│  - Dashboard data filtering                                  │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── AuthProvider (Enhanced with role management)
│   ├── useAuth hook (Extended with role utilities)
│   └── Role state management
├── Routes
│   ├── Public Routes
│   │   ├── / (Home)
│   │   ├── /news (News List)
│   │   ├── /news/:id (News Detail)
│   │   ├── /about
│   │   └── /auth (Login with role-based redirect)
│   └── Protected Routes (RoleBasedRoute wrapper)
│       ├── /admin (Admin Dashboard) - admin only
│       ├── /active-member (Active Member Dashboard) - active_member only
│       ├── /executive (Executive Dashboard) - executive only
│       └── /member (Member Dashboard) - member only
└── Dashboard Components
    ├── AdminDashboard
    │   ├── NewsManagement
    │   ├── UserManagement (with role assignment)
    │   ├── EventManagement
    │   └── ReportManagement
    ├── ActiveMemberDashboard
    │   ├── EventsList
    │   ├── ResourcesAccess
    │   └── VotingAccess
    ├── ExecutiveDashboard
    │   ├── MemberActivityReports
    │   ├── EventCoordination
    │   └── Statistics
    └── MemberDashboard
        ├── NewsView
        ├── EventsView
        └── ResourcesView
```

## Components and Interfaces

### 1. Enhanced Authentication System

#### useAuth Hook Extension

```typescript
interface UserRole = 'admin' | 'active_member' | 'executive' | 'member';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;  // NEW: Current user's role
  isAdmin: boolean;
  isActiveMember: boolean;     // NEW
  isExecutive: boolean;        // NEW
  isMember: boolean;           // NEW
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  getUserRole: () => Promise<UserRole | null>;  // NEW
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;  // NEW
}
```

**Implementation Details:**
- Extend `useAuth` hook to fetch and cache user role from `user_roles` table
- Add role checking utilities (`isActiveMember`, `isExecutive`, etc.)
- Implement `hasPermission` function for flexible role-based checks
- Cache role in React state to avoid repeated database queries
- Update role state when user signs in/out

#### RoleBasedRoute Component

```typescript
interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

function RoleBasedRoute({ children, allowedRoles, redirectTo }: RoleBasedRouteProps) {
  // Check authentication
  // Check if user's role is in allowedRoles
  // Redirect to role-specific dashboard if not allowed
  // Show loading state while checking
}
```

**Routing Logic:**
1. Check if user is authenticated
2. If not authenticated → redirect to `/auth`
3. If authenticated, fetch user role
4. If role not in `allowedRoles` → redirect to role-specific dashboard
5. If role is allowed → render children

**Role-Specific Dashboard Routes:**
- Admin → `/admin`
- Active Member → `/active-member`
- Executive → `/executive`
- Member → `/member`

### 2. Dashboard Components

#### Admin Dashboard
**Location:** `src/pages/AdminDashboard.tsx`

**Features:**
- Full access to all management tabs
- User role management interface
- News article creation and editing
- System statistics and analytics
- Event, resource, and report management

**Layout:**
```typescript
<AdminLayout>
  <Tabs>
    <Tab value="news">
      <NewsManagementTab />
    </Tab>
    <Tab value="users">
      <UsersTab />  {/* Enhanced with role management */}
    </Tab>
    <Tab value="events">
      <EventsTab />
    </Tab>
    <Tab value="reports">
      <ReportsTab />
    </Tab>
    {/* Other admin tabs */}
  </Tabs>
</AdminLayout>
```

#### Active Member Dashboard
**Location:** `src/pages/ActiveMemberDashboard.tsx`

**Features:**
- View and RSVP to events
- Access member-only resources
- Participate in elections/voting
- View news articles
- Submit anonymous reports

**Layout:**
```typescript
<Layout>
  <DashboardHeader role="Active Member" />
  <Grid>
    <UpcomingEvents />
    <RecentNews />
    <QuickActions />
    <Resources />
  </Grid>
</Layout>
```

#### Executive Dashboard
**Location:** `src/pages/ExecutiveDashboard.tsx`

**Features:**
- All active member features
- Member activity reports
- Event coordination tools
- Club statistics
- Executive announcements

**Layout:**
```typescript
<Layout>
  <DashboardHeader role="Executive" />
  <Grid>
    <MemberActivityStats />
    <EventCoordination />
    <UpcomingEvents />
    <ExecutiveAnnouncements />
  </Grid>
</Layout>
```

#### Member Dashboard
**Location:** `src/pages/MemberDashboard.tsx`

**Features:**
- View public news
- View upcoming events
- Access public resources
- Submit anonymous reports
- View club information

**Layout:**
```typescript
<Layout>
  <DashboardHeader role="Member" />
  <Grid>
    <LatestNews />
    <UpcomingEvents />
    <PublicResources />
    <QuickActions />
  </Grid>
</Layout>
```

### 3. News Management System

#### News Data Model

```typescript
interface NewsArticle {
  id: string;
  title: string;
  content: string;  // Rich text HTML
  excerpt: string;  // Short summary for list view
  featured_image_url: string | null;
  author_id: string;
  author_name: string;  // Joined from profiles
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  published: boolean;
  published_at: Date | null;
}
```

#### News Management Component (Admin)
**Location:** `src/components/admin/NewsManagementTab.tsx`

**Features:**
- List all news articles (published and drafts)
- Create new article with rich text editor
- Edit existing articles
- Delete articles
- Toggle publish status
- Upload featured images
- Schedule publication

**UI Structure:**
```typescript
<NewsManagementTab>
  <Header>
    <Button onClick={createNewArticle}>Create Article</Button>
  </Header>
  <NewsTable>
    {articles.map(article => (
      <NewsRow>
        <Title>{article.title}</Title>
        <Status>{article.published ? 'Published' : 'Draft'}</Status>
        <Actions>
          <EditButton />
          <DeleteButton />
          <TogglePublishButton />
        </Actions>
      </NewsRow>
    ))}
  </NewsTable>
  <NewsEditorDialog>
    <RichTextEditor />
    <ImageUploader />
    <PublishControls />
  </NewsEditorDialog>
</NewsManagementTab>
```

#### News List Page (Public)
**Location:** `src/pages/News.tsx`

**Features:**
- Display all published news articles
- Grid/list view of articles
- Featured image thumbnails
- Article excerpts
- Publication date and author
- Click to view full article

**UI Structure:**
```typescript
<Layout>
  <PageHeader title="News & Updates" />
  <NewsGrid>
    {articles.map(article => (
      <NewsCard>
        <FeaturedImage src={article.featured_image_url} />
        <Title>{article.title}</Title>
        <Excerpt>{article.excerpt}</Excerpt>
        <Meta>
          <Author>{article.author_name}</Author>
          <Date>{article.published_at}</Date>
        </Meta>
        <ReadMoreLink to={`/news/${article.id}`} />
      </NewsCard>
    ))}
  </NewsGrid>
</Layout>
```

#### News Detail Page (Public)
**Location:** `src/pages/NewsDetail.tsx`

**Features:**
- Display full article content
- Featured image
- Author information
- Publication date
- Rich text formatting
- Back to news list link

**UI Structure:**
```typescript
<Layout>
  <Article>
    <FeaturedImage src={article.featured_image_url} />
    <Header>
      <Title>{article.title}</Title>
      <Meta>
        <Author>{article.author_name}</Author>
        <Date>{article.published_at}</Date>
      </Meta>
    </Header>
    <Content dangerouslySetInnerHTML={{ __html: article.content }} />
    <BackLink to="/news">Back to News</BackLink>
  </Article>
</Layout>
```

### 4. User Management Enhancement

#### UsersTab Component Enhancement
**Location:** `src/components/admin/UsersTab.tsx`

**New Features:**
- Display user role in user list
- Role assignment dropdown for each user
- Filter users by role
- Bulk role assignment

**UI Addition:**
```typescript
<UserRow>
  <UserInfo>{user.full_name}</UserInfo>
  <Email>{user.email}</Email>
  <RoleSelect
    value={user.role}
    onChange={(newRole) => updateUserRole(user.id, newRole)}
  >
    <option value="admin">Admin</option>
    <option value="active_member">Active Member</option>
    <option value="executive">Executive</option>
    <option value="member">Member</option>
  </RoleSelect>
  <Actions>...</Actions>
</UserRow>
```

## Data Models

### Database Schema Changes

#### 1. Extend app_role Enum

```sql
-- Alter existing enum to add new roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'active_member';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'executive';
```

#### 2. Update user_roles Table Constraint

```sql
-- Ensure each user has exactly one role
-- Drop existing unique constraint
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Add new unique constraint on user_id only
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);
```

#### 3. Enhance news Table

```sql
-- Add new columns to news table
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_author ON public.news(created_by);
```

#### 4. Update RLS Policies

```sql
-- Update news policies to use published_at
CREATE POLICY "Anyone can view published news with date" ON public.news
  FOR SELECT USING (
    published = true AND 
    (published_at IS NULL OR published_at <= now())
  );

-- Add policies for new roles
CREATE POLICY "Active members can view member resources" ON public.resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('active_member', 'executive', 'admin')
    )
  );

CREATE POLICY "Executives can view activity reports" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('executive', 'admin')
    )
  );
```

### TypeScript Interfaces

```typescript
// User Role Types
type UserRole = 'admin' | 'active_member' | 'executive' | 'member';

interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
}

// News Types
interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string | null;
  published: boolean;
  published_at: Date | null;
  created_by: string;
  author_name: string;
  created_at: Date;
  updated_at: Date;
}

interface CreateNewsInput {
  title: string;
  content: string;
  excerpt: string;
  image_url?: string | null;
  published?: boolean;
  published_at?: Date | null;
}

interface UpdateNewsInput extends Partial<CreateNewsInput> {
  id: string;
}

// Dashboard Data Types
interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  upcomingEvents: number;
  pendingReports: number;
}

interface MemberActivity {
  user_id: string;
  user_name: string;
  events_attended: number;
  resources_accessed: number;
  last_active: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Single Role Assignment
*For any* authenticated user, querying their role should return exactly one role value from the set {admin, active_member, executive, member}.

**Validates: Requirements 1.5**

### Property 2: Role-Based Route Access
*For any* authenticated user with role R and any protected route with allowed roles A, the user can access the route if and only if R is in A.

**Validates: Requirements 9.2, 9.4, 9.5**

### Property 3: Dashboard Redirect Consistency
*For any* authenticated user with role R, after successful login, the system redirects to the dashboard corresponding to R.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 4: News Article Visibility
*For any* news article, it is visible to non-admin users if and only if its published field is true and its published_at date is null or in the past.

**Validates: Requirements 8.1, 7.3**

### Property 5: Admin News Management Authority
*For any* news article operation (create, update, delete), the operation succeeds if and only if the requesting user has admin role.

**Validates: Requirements 7.1, 7.2, 7.4, 7.5**

### Property 6: Role Permission Hierarchy
*For any* feature accessible to role R, if a user with role R' where R' has higher privileges than R attempts to access the feature, the access is granted.

**Validates: Requirements 5.1, 9.5**

Note: Privilege hierarchy: admin > executive > active_member > member

### Property 7: News Article Author Attribution
*For any* news article created by user U, the article's author_id field equals U's user ID and the author_name field equals U's full name from the profiles table.

**Validates: Requirements 7.2, 8.3**

### Property 8: Unauthenticated Access Restriction
*For any* protected route, if an unauthenticated user attempts to access it, the system redirects to the login page.

**Validates: Requirements 9.1**

### Property 9: Role Update Immediate Effect
*For any* user U whose role is updated from R1 to R2 by an admin, subsequent permission checks for U use role R2.

**Validates: Requirements 1.4**

### Property 10: News List Chronological Ordering
*For any* two published news articles A1 and A2 where A1.published_at > A2.published_at, A1 appears before A2 in the news list.

**Validates: Requirements 8.1**

## Error Handling

### Authentication Errors

1. **Invalid Credentials**
   - Display user-friendly error message
   - Do not reveal whether email or password is incorrect
   - Log failed attempts for security monitoring

2. **Role Not Found**
   - Assign default 'member' role if user has no role
   - Log warning for investigation
   - Allow user to continue with member permissions

3. **Session Expiration**
   - Redirect to login page
   - Preserve intended destination for post-login redirect
   - Display session timeout message

### Authorization Errors

1. **Insufficient Permissions**
   - Redirect to user's role-specific dashboard
   - Display toast notification explaining access restriction
   - Log unauthorized access attempts

2. **Role Update Failures**
   - Display error message to admin
   - Rollback any partial changes
   - Maintain user's current role

### News Management Errors

1. **Image Upload Failures**
   - Display error message with retry option
   - Allow saving article without image
   - Validate image size and format before upload

2. **Content Validation Errors**
   - Highlight required fields
   - Display inline validation messages
   - Prevent form submission until valid

3. **Publish Failures**
   - Display error message
   - Keep article in draft state
   - Log error for admin review

4. **Database Errors**
   - Display generic error message to user
   - Log detailed error for debugging
   - Implement retry logic for transient failures

### Dashboard Loading Errors

1. **Data Fetch Failures**
   - Display error state with retry button
   - Show cached data if available
   - Log error for monitoring

2. **Permission Errors**
   - Redirect to appropriate dashboard
   - Display explanation message
   - Update cached role if stale

## Testing Strategy

### Unit Testing

**Framework:** Vitest (already configured in the project)

**Test Coverage:**

1. **Authentication Tests**
   - Test `useAuth` hook role fetching
   - Test role checking utilities (`isAdmin`, `isActiveMember`, etc.)
   - Test `hasPermission` function with various role combinations
   - Test sign in/out role state updates

2. **Component Tests**
   - Test `RoleBasedRoute` with different roles and allowed roles
   - Test dashboard components render correct content for each role
   - Test news form validation
   - Test news list filtering and sorting

3. **Utility Function Tests**
   - Test role comparison functions
   - Test date formatting for news articles
   - Test permission checking logic

**Example Unit Test:**
```typescript
describe('useAuth role checking', () => {
  it('should correctly identify admin role', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createAuthWrapper({ role: 'admin' })
    });
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isActiveMember).toBe(false);
  });

  it('should grant permission for allowed roles', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createAuthWrapper({ role: 'executive' })
    });
    expect(result.current.hasPermission(['executive', 'admin'])).toBe(true);
    expect(result.current.hasPermission(['admin'])).toBe(false);
  });
});
```

### Property-Based Testing

**Framework:** fast-check (to be installed)

**Configuration:** Minimum 100 iterations per property test

**Property Tests:**

Each property test must be tagged with:
```typescript
// Feature: role-based-access-and-news, Property N: [property description]
```

1. **Property 1: Single Role Assignment**
   ```typescript
   // Feature: role-based-access-and-news, Property 1: Single Role Assignment
   fc.assert(
     fc.asyncProperty(
       fc.uuid(),  // user_id
       async (userId) => {
         const roles = await getUserRoles(userId);
         return roles.length === 1;
       }
     ),
     { numRuns: 100 }
   );
   ```

2. **Property 2: Role-Based Route Access**
   ```typescript
   // Feature: role-based-access-and-news, Property 2: Role-Based Route Access
   fc.assert(
     fc.property(
       fc.constantFrom('admin', 'active_member', 'executive', 'member'),
       fc.array(fc.constantFrom('admin', 'active_member', 'executive', 'member')),
       (userRole, allowedRoles) => {
         const canAccess = checkRouteAccess(userRole, allowedRoles);
         return canAccess === allowedRoles.includes(userRole);
       }
     ),
     { numRuns: 100 }
   );
   ```

3. **Property 4: News Article Visibility**
   ```typescript
   // Feature: role-based-access-and-news, Property 4: News Article Visibility
   fc.assert(
     fc.property(
       fc.boolean(),  // published
       fc.option(fc.date(), { nil: null }),  // published_at
       (published, publishedAt) => {
         const isVisible = checkNewsVisibility(published, publishedAt);
         const shouldBeVisible = published && 
           (publishedAt === null || publishedAt <= new Date());
         return isVisible === shouldBeVisible;
       }
     ),
     { numRuns: 100 }
   );
   ```

4. **Property 6: Role Permission Hierarchy**
   ```typescript
   // Feature: role-based-access-and-news, Property 6: Role Permission Hierarchy
   fc.assert(
     fc.property(
       fc.constantFrom('admin', 'executive', 'active_member', 'member'),
       fc.constantFrom('admin', 'executive', 'active_member', 'member'),
       (userRole, requiredRole) => {
         const hierarchy = ['member', 'active_member', 'executive', 'admin'];
         const userLevel = hierarchy.indexOf(userRole);
         const requiredLevel = hierarchy.indexOf(requiredRole);
         const hasAccess = checkPermission(userRole, requiredRole);
         return hasAccess === (userLevel >= requiredLevel);
       }
     ),
     { numRuns: 100 }
   );
   ```

5. **Property 10: News List Chronological Ordering**
   ```typescript
   // Feature: role-based-access-and-news, Property 10: News List Chronological Ordering
   fc.assert(
     fc.property(
       fc.array(
         fc.record({
           id: fc.uuid(),
           published_at: fc.date(),
           published: fc.constant(true)
         }),
         { minLength: 2 }
       ),
       (articles) => {
         const sorted = sortNewsByDate(articles);
         for (let i = 0; i < sorted.length - 1; i++) {
           if (sorted[i].published_at < sorted[i + 1].published_at) {
             return false;
           }
         }
         return true;
       }
     ),
     { numRuns: 100 }
   );
   ```

### Integration Testing

1. **Authentication Flow**
   - Test complete login flow with role assignment
   - Test role-based redirect after login
   - Test session persistence across page reloads

2. **News Management Flow**
   - Test creating, editing, and publishing news articles
   - Test image upload and storage
   - Test news visibility based on publish status

3. **Dashboard Access Flow**
   - Test accessing each dashboard with appropriate role
   - Test unauthorized access attempts
   - Test navigation between allowed pages

### Manual Testing Checklist

1. **Role Assignment**
   - [ ] Admin can assign roles to users
   - [ ] Role changes take effect immediately
   - [ ] Users see appropriate dashboard after role change

2. **Dashboard Access**
   - [ ] Each role sees correct dashboard
   - [ ] Unauthorized routes redirect properly
   - [ ] Navigation menu shows role-appropriate options

3. **News Management**
   - [ ] Admin can create news articles
   - [ ] Rich text editor works correctly
   - [ ] Image upload functions properly
   - [ ] Published articles appear on news page
   - [ ] Draft articles not visible to public

4. **Responsive Design**
   - [ ] Dashboards work on mobile devices
   - [ ] News pages responsive
   - [ ] Forms usable on small screens

## Implementation Notes

### Technology Stack

- **Frontend:** React 18 with TypeScript
- **Routing:** React Router DOM v6
- **State Management:** React Query for server state, React Context for auth
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Rich Text Editor:** TipTap or React Quill (to be decided during implementation)
- **Property Testing:** fast-check

### Migration Strategy

1. **Database Migration**
   - Create migration file to extend `app_role` enum
   - Update `user_roles` table constraints
   - Enhance `news` table with new columns
   - Update RLS policies

2. **Code Migration**
   - Extend `useAuth` hook with new role utilities
   - Create new dashboard components
   - Update routing configuration
   - Enhance `UsersTab` with role management

3. **Data Migration**
   - Existing users default to 'member' role if not admin
   - Existing news articles get `published_at` set to `created_at` if published

### Performance Considerations

1. **Role Caching**
   - Cache user role in React state
   - Invalidate cache on role update
   - Use React Query for automatic cache management

2. **News List Pagination**
   - Implement infinite scroll or pagination
   - Load 10-20 articles per page
   - Prefetch next page for smooth UX

3. **Dashboard Data**
   - Use React Query for automatic caching
   - Implement stale-while-revalidate strategy
   - Show cached data while fetching updates

### Security Considerations

1. **Role Verification**
   - Always verify role on server side (RLS policies)
   - Client-side checks for UX only
   - Never trust client-provided role information

2. **News Content**
   - Sanitize HTML content to prevent XSS
   - Validate image URLs
   - Implement rate limiting for article creation

3. **Authorization**
   - Use Supabase RLS for all data access
   - Implement proper error handling for unauthorized access
   - Log security-relevant events

### Accessibility

1. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Proper focus management in modals
   - Skip links for main content

2. **Screen Readers**
   - Proper ARIA labels
   - Semantic HTML structure
   - Descriptive link text

3. **Visual Design**
   - Sufficient color contrast
   - Clear visual hierarchy
   - Responsive text sizing
