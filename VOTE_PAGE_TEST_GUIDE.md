# Vote Page Test Guide

## Issue Fixed: Candidates and Elections Not Appearing

The issue was that the admin components (ElectionsTab and CandidatesTab) were using mock data instead of connecting to the real Supabase database. This has been fixed.

## How to Test

### Step 1: Create an Election
1. Go to `/admin` (admin login required)
2. Navigate to "Elections" tab
3. Click "Add Election"
4. Fill in:
   - Title: "Test Election 2025"
   - Description: "Test election for voting system"
   - Status: "draft" (default)
   - Start Date: Today's date
   - End Date: Tomorrow's date
5. Click "Save"

### Step 2: Add Candidates
1. In admin panel, go to "Candidates" tab
2. Select the election you just created from the dropdown
3. Add candidates for each position:

**President Candidate:**
- Full Name: "John Doe"
- Position: "president"
- Department: "Computer Science"
- Batch: "2022"
- Manifesto: "I will improve student services"

**Vice President Candidate:**
- Full Name: "Jane Smith"
- Position: "vice_president"
- Department: "Engineering"
- Batch: "2021"
- Manifesto: "I will enhance campus facilities"

**Secretary Candidate:**
- Full Name: "Bob Johnson"
- Position: "secretary"
- Department: "Business"
- Batch: "2023"
- Manifesto: "I will ensure transparent communication"

### Step 3: Open the Election
1. Go back to "Elections" tab
2. Find your election
3. Click the "Start" button to change status from "draft" to "open"
4. The status badge should change to "Open"

### Step 4: Test Voting
1. Go to `/vote` page
2. You should now see:
   - The election title and description
   - Voter information form
   - Three sections for President, Vice President, and Secretary
   - Each section should show the candidates you added
   - Candidate cards with names, departments, batches, and manifestos

### Step 5: Complete a Vote
1. Fill in voter information:
   - Full Name: "Test Voter"
   - Student ID: "ST001"
   - Department: "Test Department"
   - Batch: "2024"
2. Select one candidate for each position
3. Click "Submit Vote"
4. Should see success message

### Step 6: Verify Vote Recorded
1. Go back to admin panel
2. Check if vote was recorded in the database
3. Try voting again with same user - should show "Vote Submitted" message

## What Was Fixed

1. **ElectionsTab.tsx**: 
   - Removed mock data
   - Added real Supabase database operations
   - Added fetchElections(), handleSave(), handleDelete(), toggleElectionStatus()

2. **CandidatesTab.tsx**:
   - Removed mock data
   - Added real Supabase database operations
   - Added fetchElections(), fetchCandidates(), handleSave(), handleDelete()
   - Connected to real elections from database

3. **Vote.tsx**:
   - Added debug logging (can be removed later)
   - Better error handling for missing elections/candidates

## Database Tables Used

- `elections`: Stores election information
- `candidates`: Stores candidate information linked to elections
- `votes`: Stores user votes

## Key Features Now Working

✅ Admin can create real elections in database
✅ Admin can add candidates to real elections
✅ Admin can change election status (draft → open → closed)
✅ Vote page shows real elections and candidates from database
✅ Users can vote for real candidates
✅ Votes are stored in database with duplicate prevention
✅ Election results can be calculated from real vote data