# System Settings Test Guide

## Testing Registration Control

The system settings now properly control registration access. Here's how to test:

### 1. Test Registration Disabled
1. Go to `/admin` (admin login required)
2. Navigate to "System Settings" tab
3. Under "Security Settings", turn OFF "Registration Enabled"
4. Click "Save Settings"
5. Go to `/auth` page
6. You should see:
   - Only "Sign In" tab (no "Sign Up" tab)
   - Blue notice: "Registration is currently disabled"
   - Debug status showing "Disabled"

### 2. Test Registration Enabled
1. Go back to admin system settings
2. Turn ON "Registration Enabled" (this will automatically disable voting)
3. Click "Save Settings"
4. Go to `/auth` page
5. You should see:
   - Both "Sign In" and "Sign Up" tabs
   - No restriction notice
   - Debug status showing "Enabled"

### 3. Test Voting vs Registration Mutual Exclusivity
1. In admin settings, enable "Voting System"
2. Notice "Registration Enabled" automatically turns off
3. Save settings
4. Go to `/auth` - should only show sign in
5. Enable "Registration Enabled"
6. Notice "Voting System" automatically turns off

### 4. Test Persistence
1. Change settings in admin panel
2. Refresh the page
3. Settings should persist (stored in localStorage)
4. Go to `/auth` page - should reflect the saved settings

## Technical Implementation

- Settings are stored in localStorage for persistence
- SystemSettingsProvider manages global state
- Auth page reads `isRegistrationEnabled` from context
- Admin panel updates are immediately reflected across the app
- Mutual exclusivity prevents voting and registration being enabled simultaneously

## Debug Information

- Console logs in Auth page show current settings
- Admin panel shows both context and local state values
- Settings persist across browser sessions via localStorage