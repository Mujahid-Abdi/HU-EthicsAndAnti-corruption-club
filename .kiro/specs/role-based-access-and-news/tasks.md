# Implementation Plan: Role-Based Access and News Management

## Overview

This implementation plan breaks down the role-based access control system and news management feature into discrete, incremental tasks. Each task builds on previous work, ensuring the system remains functional throughout development. The plan prioritizes core functionality first, with testing integrated at key milestones.

## Tasks

- [ ] 1. Database Schema Updates
  - Create migration file to extend the `app_role` enum with new roles (active_member, executive)
  - Update `user_roles` table to enforce single role per user constraint
  - Enhance `news` table with `author_name` and `published_at` columns
  - Create database indexes for performance optimization
  - Update RLS policies for new roles and news visibility rules
  - _Requirements: 1.1, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 2. Enhanced Authentication System
  - [ ] 2.1 Extend useAuth hook with role management
    - Add `userRole`, `isActiveMember`, `isExecutive`, `isMember` state
    - Implement `getUserRole()` function to fetch role from database
    - Implement `hasPermission()` function for flexible role checking
    - Update auth state management to include role caching
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 2.2 Write property test for single role assignment
    - **Property 1: Single Role Assignment**
    - **Validates: Requirements 1.5**

  - [ ]* 2.3 Write property test for role permission hierarchy
    - **Property 6: Role Permission Hierarchy**
    - **Validates: Requirements 5.1, 9.5**

- [ ] 3. Role-Based Routing System
  - [ ] 3.1 Create RoleBasedRoute component
    - Implement authentication check
    - Implement role validation logic
    - Add role-specific redirect logic
    - Add loading state handling
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 3.2 Write property test for role-based route access
    - **Property 2: Role-Based Route Access**
    - **Validates: Requirements 9.2, 9.4, 9.5**

  - [ ]* 3.3 Write property test for unauthenticated access restriction
    - **Property 8: Unauthenticated Access Restriction**
    - **Validates: Requirements 9.1**

  - [ ] 3.4 Update App.tsx routing configuration
    - Add routes for each role-specific dashboard
    - Wrap protected routes with RoleBasedRoute
    - Configure allowed roles for each route
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 4. Checkpoint - Verify authentication and routing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Dashboard Components
  - [ ] 5.1 Create AdminDashboard component
    - Implement layout with navigation tabs
    - Add access to all management features
    - Display system statistics
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 5.2 Create ActiveMemberDashboard component
    - Implement layout with member features
    - Add upcoming events section
    - Add resources access section
    - Add voting access section
    - _Requirements: 2.2, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 5.3 Create ExecutiveDashboard component
    - Extend ActiveMemberDashboard features
    - Add member activity reports section
    - Add event coordination tools
    - Add club statistics section
    - _Requirements: 2.3, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 5.4 Create MemberDashboard component
    - Implement basic member layout
    - Add news view section
    - Add events view section
    - Add resources view section
    - _Requirements: 2.4, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 5.5 Write property test for dashboard redirect consistency
    - **Property 3: Dashboard Redirect Consistency**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [ ] 6. News Data Layer
  - [ ] 6.1 Create news TypeScript interfaces and types
    - Define NewsArticle interface
    - Define CreateNewsInput interface
    - Define UpdateNewsInput interface
    - _Requirements: 7.1, 7.2, 8.3_

  - [ ] 6.2 Implement news API functions using Supabase
    - Create `fetchPublishedNews()` function
    - Create `fetchNewsById()` function
    - Create `createNewsArticle()` function (admin only)
    - Create `updateNewsArticle()` function (admin only)
    - Create `deleteNewsArticle()` function (admin only)
    - Create `togglePublishStatus()` function (admin only)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 8.1_

  - [ ]* 6.3 Write property test for news article visibility
    - **Property 4: News Article Visibility**
    - **Validates: Requirements 8.1, 7.3**

  - [ ]* 6.4 Write property test for admin news management authority
    - **Property 5: Admin News Management Authority**
    - **Validates: Requirements 7.1, 7.2, 7.4, 7.5**

  - [ ]* 6.5 Write property test for news article author attribution
    - **Property 7: News Article Author Attribution**
    - **Validates: Requirements 7.2, 8.3**

- [ ] 7. News Management Interface (Admin)
  - [ ] 7.1 Create NewsManagementTab component
    - Implement news list table with all articles
    - Add create new article button
    - Add edit, delete, and publish toggle actions
    - Implement filtering by published status
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

  - [ ] 7.2 Create NewsEditorDialog component
    - Implement form with title, content, excerpt fields
    - Add rich text editor for content (using TipTap or React Quill)
    - Add featured image URL input
    - Add publish toggle and scheduled publish date picker
    - Implement form validation
    - _Requirements: 7.1, 7.6, 7.7_

  - [ ] 7.3 Integrate NewsManagementTab into AdminDashboard
    - Add news tab to admin dashboard
    - Wire up news management functionality
    - _Requirements: 3.2_

  - [ ]* 7.4 Write unit tests for news form validation
    - Test required field validation
    - Test content length validation
    - Test date validation for scheduled publishing
    - _Requirements: 7.1_

- [ ] 8. Public News Pages
  - [ ] 8.1 Create News list page component
    - Implement grid layout for news cards
    - Display featured images, titles, excerpts
    - Show author and publication date
    - Add link to full article
    - Implement empty state for no articles
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ] 8.2 Create NewsDetail page component
    - Display full article with featured image
    - Show article title, author, and date
    - Render rich text content safely
    - Add back to news list navigation
    - _Requirements: 8.2, 8.3, 8.4_

  - [ ] 8.3 Add news routes to App.tsx
    - Add `/news` route for news list
    - Add `/news/:id` route for article detail
    - Update navigation to include news link
    - _Requirements: 8.1, 8.2_

  - [ ]* 8.4 Write property test for news list chronological ordering
    - **Property 10: News List Chronological Ordering**
    - **Validates: Requirements 8.1**

  - [ ]* 8.5 Write unit tests for news display components
    - Test news card rendering
    - Test article detail rendering
    - Test empty state display
    - _Requirements: 8.1, 8.2, 8.5_

- [ ] 9. Checkpoint - Verify news functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. User Management Enhancement
  - [ ] 10.1 Update UsersTab component with role management
    - Add role column to user table
    - Implement role selection dropdown for each user
    - Add role filter functionality
    - Implement role update API call
    - _Requirements: 1.3, 1.4_

  - [ ]* 10.2 Write property test for role update immediate effect
    - **Property 9: Role Update Immediate Effect**
    - **Validates: Requirements 1.4**

  - [ ]* 10.3 Write unit tests for role assignment UI
    - Test role dropdown rendering
    - Test role update action
    - Test role filter functionality
    - _Requirements: 1.3, 1.4_

- [ ] 11. Login Page Enhancement
  - [ ] 11.1 Update Auth page with role-based redirect
    - Implement post-login role check
    - Add redirect logic to role-specific dashboard
    - Update sign-in success handler
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 11.2 Write integration tests for login flow
    - Test login with each role type
    - Test redirect to correct dashboard
    - Test session persistence
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 12. Navigation and Layout Updates
  - [ ] 12.1 Update Header component with role-based navigation
    - Show/hide menu items based on user role
    - Add dashboard link for authenticated users
    - Update navigation logic
    - _Requirements: 2.5_

  - [ ] 12.2 Update Layout component for role-specific styling
    - Add role-specific CSS classes
    - Implement role-based header variants
    - _Requirements: 2.5_

- [ ] 13. Error Handling and Edge Cases
  - [ ] 13.1 Implement error handling for authentication
    - Add error states for role fetch failures
    - Implement fallback to member role
    - Add error logging
    - _Requirements: 1.2_

  - [ ] 13.2 Implement error handling for news management
    - Add error states for image upload failures
    - Implement validation error display
    - Add retry logic for transient failures
    - _Requirements: 7.1, 7.2_

  - [ ] 13.3 Implement error handling for dashboard data
    - Add error states for data fetch failures
    - Implement retry functionality
    - Show cached data when available
    - _Requirements: 3.1, 4.1, 5.1, 6.1_

  - [ ]* 13.4 Write unit tests for error scenarios
    - Test authentication error handling
    - Test news management error handling
    - Test dashboard error states
    - _Requirements: 1.2, 7.1, 7.2_

- [ ] 14. Final Integration and Testing
  - [ ] 14.1 Run all property-based tests
    - Execute all 10 property tests with 100+ iterations
    - Fix any failing properties
    - Document any edge cases discovered
    - _Requirements: All_

  - [ ] 14.2 Run full integration test suite
    - Test complete user flows for each role
    - Test news creation and publishing workflow
    - Test role assignment workflow
    - _Requirements: All_

  - [ ] 14.3 Perform manual testing
    - Test on different screen sizes
    - Test with different user roles
    - Test news management end-to-end
    - Verify accessibility
    - _Requirements: All_

- [ ] 15. Final checkpoint - Complete feature verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Integration tests verify complete user workflows
- The implementation follows a bottom-up approach: database → auth → routing → UI
- Rich text editor choice (TipTap vs React Quill) to be decided during task 7.2
- fast-check library needs to be installed for property-based testing
