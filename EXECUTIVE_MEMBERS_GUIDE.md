# Executive Members Management

## Overview
The Executive Members feature allows administrators to manage and display the club's executive committee members on the Contact page.

## Features

### Admin Interface
- **Location**: Admin Dashboard → Executives tab
- **Add Members**: Click "Add Member" to create new executive positions
- **Edit Members**: Click "Edit" on any member card to modify details
- **Delete Members**: Click the trash icon to remove members
- **Reorder**: Use the display_order field to control the order of appearance

### Member Fields
- **Full Name** (required): The executive's full name
- **Position** (required): Their role (e.g., President, Secretary, Treasurer)
- **Email**: Contact email (optional)
- **Phone**: Contact phone number (optional)
- **Bio**: Brief biography or description (optional)
- **Image URL**: Profile picture URL (optional)
- **Display Order**: Number to control sorting (lower numbers appear first)
- **Active Status**: Toggle to show/hide on the website

### Public Display
- **Location**: Contact page → Executive Committee section
- **Layout**: Responsive grid showing member cards
- **Information Shown**: Name, position, bio, contact details (if provided)
- **Fallback**: Shows placeholder message when no active members exist

## Database Structure

The `executive_members` table includes:
- `id`: UUID primary key
- `full_name`: Text (required)
- `position`: Text (required)
- `email`: Text (optional)
- `phone`: Text (optional)
- `bio`: Text (optional)
- `image_url`: Text (optional)
- `display_order`: Integer (default: 0)
- `is_active`: Boolean (default: true)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Default Members
The system comes pre-populated with 7 placeholder executive positions:
1. President
2. Vice President
3. Secretary
4. Treasurer
5. Public Relations Officer
6. Events Coordinator
7. Faculty Advisor

## Permissions
- **Public**: Can view active executive members on the Contact page
- **Admins**: Can create, read, update, and delete all executive members

## Usage Instructions

### For Admins:
1. Navigate to Admin Dashboard
2. Click on the "Executives" tab
3. Use "Add Member" to create new positions
4. Fill in the required fields (name and position)
5. Optionally add contact details, bio, and profile image
6. Set display order for proper sorting
7. Toggle "Active" status to control visibility
8. Save changes

### For Users:
- Visit the Contact page to see the current executive committee
- Contact information is displayed for members who have provided it
- Members are sorted by their display order

## Migration
Run the migration file `20251217000000_create_executive_members.sql` to set up the database table and default data.