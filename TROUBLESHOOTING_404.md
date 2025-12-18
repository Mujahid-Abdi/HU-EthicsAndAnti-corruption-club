# Troubleshooting 404 Errors

## Common Causes and Solutions

### 1. **Missing Image Files**
**Issue**: The ethics-hero.png or haramaya-logo.jpg might not be loading properly.

**Solution**:
- Verify files exist in `public/` folder:
  - `public/ethics-hero.png` ✅
  - `public/haramaya-logo.jpg` ✅
- Clear browser cache and reload
- Check browser console for specific 404 error path

### 2. **Development Server Issues**
**Issue**: Dev server might not be serving static assets correctly.

**Solution**:
```bash
# Stop the dev server (Ctrl+C)
# Clear cache and restart
npm run dev
```

### 3. **Build Issues**
**Issue**: Assets might not be copied to dist folder during build.

**Solution**:
```bash
# Clean build
rm -rf dist
npm run build
```

### 4. **Browser Cache**
**Issue**: Old cached resources causing 404 errors.

**Solution**:
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache completely
- Try incognito/private browsing mode

### 5. **Path Issues**
**Issue**: Incorrect asset paths in code.

**Current Paths** (All Correct):
- Hero image: `/ethics-hero.png`
- Logo: `/haramaya-logo.jpg`
- Favicon: `/haramaya-logo.jpg`

### 6. **Network Requests**
**Issue**: External resources (fonts, CDN) failing to load.

**Check**:
- Internet connection
- Firewall settings
- Ad blockers or browser extensions

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for specific 404 error with file path
4. Note the exact resource that's failing

### Step 2: Check Network Tab
1. Open DevTools Network tab
2. Reload page
3. Filter by "404" status
4. Identify which resource is missing

### Step 3: Verify File Paths
```bash
# Check if files exist
ls public/ethics-hero.png
ls public/haramaya-logo.jpg
```

### Step 4: Test Build
```bash
# Build and preview
npm run build
npm run preview
```

## Quick Fixes

### Fix 1: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Fix 2: Clear Node Modules
```bash
rm -rf node_modules
npm install
npm run dev
```

### Fix 3: Check Vite Config
Ensure `vite.config.ts` has proper public directory configuration.

## Expected Behavior

### ✅ **Working State**
- All images load correctly
- No 404 errors in console
- Hero section displays custom image
- Logo appears in navbar and footer
- Favicon shows in browser tab

### ❌ **Error State**
- 404 errors in console
- Missing images (broken image icons)
- Fallback images loading instead of custom ones

## Admin Panel Specific

### Admin Layout Assets
The new admin panel uses:
- Lucide React icons (bundled, no external requests)
- Radix UI components (bundled)
- No external image dependencies

### If Admin Panel Shows 404
1. Check if admin components are properly imported
2. Verify AdminLayout.tsx exists
3. Check SystemSettingsTab.tsx exists
4. Ensure all admin tab components are present

## Still Having Issues?

### Check These Files
1. `src/pages/Index.tsx` - Admin panel implementation
2. `src/components/admin/AdminLayout.tsx` - Sidebar navigation
3. `src/components/admin/SystemSettingsTab.tsx` - Settings panel
4. `public/ethics-hero.png` - Hero image
5. `public/haramaya-logo.jpg` - Logo image

### Verify Imports
All admin components should be imported in Index.tsx:
- ReportsTab
- EventsTab
- NewsTab
- ResourcesTab
- ElectionsTab
- CandidatesTab
- ExecutivesTab
- UsersTab
- SystemSettingsTab

## Contact Support
If issues persist after trying all solutions:
1. Note the exact 404 error path from console
2. Check if error occurs in production build
3. Verify all dependencies are installed
4. Check for any custom configurations