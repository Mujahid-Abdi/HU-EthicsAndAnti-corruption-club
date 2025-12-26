# Firebase Setup Guide

## Overview
This project has been migrated from Supabase to Firebase. Follow this guide to set up Firebase for your Haramaya University Ethics Club application.

## Prerequisites
- Firebase account (https://firebase.google.com/)
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `haramaya-ethics-club` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select your preferred location
5. Click "Done"

## Step 4: Enable Storage

1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select same location as Firestore
5. Click "Done"

## Step 5: Get Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Enter app nickname: `haramaya-ethics-web`
5. Click "Register app"
6. Copy the configuration object

## Step 6: Update Environment Variables

Update your `.env` file with the Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 7: Set Up Firestore Security Rules

Go to Firestore Database > Rules and replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Reports - anonymous submission allowed, admins can manage
    match /reports/{reportId} {
      allow create: if request.auth != null || resource == null;
      allow read, update, delete: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Events - public read, admin write
    match /events/{eventId} {
      allow read: if resource.data.published == true;
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // News - public read, admin write
    match /news/{newsId} {
      allow read: if resource.data.published == true;
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Gallery - public read, admin write
    match /gallery/{galleryId} {
      allow read: if resource.data.published == true;
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Resources - public read, admin write
    match /resources/{resourceId} {
      allow read: if resource.data.published == true;
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Elections - public read for open elections, admin write
    match /elections/{electionId} {
      allow read: if resource.data.status in ['open', 'closed'];
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Candidates - public read for open elections, admin write
    match /candidates/{candidateId} {
      allow read: if exists(/databases/$(database)/documents/elections/$(resource.data.electionId)) &&
        get(/databases/$(database)/documents/elections/$(resource.data.electionId)).data.status in ['open', 'closed'];
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Votes - users can create their own votes, admins can read all
    match /votes/{voteId} {
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId &&
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isApproved == true;
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId ||
         (exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'));
    }
    
    // Executives - public read, admin write
    match /executives/{executiveId} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Step 8: Set Up Storage Security Rules

Go to Storage > Rules and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload files
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 9: Install Firebase CLI (Optional)

For advanced features and deployment:

```bash
npm install -g firebase-tools
firebase login
firebase init
```

## Step 10: Test the Setup

1. Start your development server: `npm run dev`
2. Try to sign up for a new account
3. The first user will automatically become an admin
4. Test the admin panel functionality

## Migration Notes

### What Changed:
- ✅ Supabase → Firebase Authentication
- ✅ Supabase Database → Firestore
- ✅ Supabase Storage → Firebase Storage
- ✅ Real-time subscriptions → Firestore listeners
- ✅ RLS Policies → Firestore Security Rules

### Key Differences:
- **Authentication**: Firebase Auth instead of Supabase Auth
- **Database**: NoSQL Firestore instead of PostgreSQL
- **Real-time**: Firestore listeners instead of Supabase subscriptions
- **File Storage**: Firebase Storage instead of Supabase Storage

### Benefits:
- Better offline support
- More flexible NoSQL structure
- Integrated with Google Cloud Platform
- Excellent mobile SDK support
- Built-in analytics

## Troubleshooting

### Common Issues:

1. **Authentication not working**
   - Check if Email/Password is enabled in Firebase Console
   - Verify environment variables are correct

2. **Database permission denied**
   - Check Firestore security rules
   - Ensure user has proper role in users collection

3. **Storage upload fails**
   - Check Storage security rules
   - Verify user is authenticated

### Support
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/