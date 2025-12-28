# Deployment Guide

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. **Push to main/master branch**: The GitHub Actions workflow will automatically build and deploy your app
2. **GitHub Pages will be available at**: `https://yourusername.github.io/HU-EthicsAndAnti-corruption-club/`

### Manual Deployment

If you prefer to deploy manually:

```bash
# Build for production
npm run build:prod

# Deploy to GitHub Pages
npm run deploy
```

### Setup Requirements

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `/ (root)`

2. **GitHub Actions** (automatic deployment):
   - The workflow file is already configured in `.github/workflows/deploy.yml`
   - It will run automatically on pushes to main/master

### Configuration

The app is configured with the correct base path for GitHub Pages in `vite.config.ts`:

```typescript
base: mode === "production" ? "/HU-EthicsAndAnti-corruption-club/" : "/",
```

This ensures all assets load correctly when deployed to GitHub Pages.

### Troubleshooting

If you see 404 errors:
1. Make sure GitHub Pages is enabled in repository settings
2. Check that the base path in `vite.config.ts` matches your repository name
3. Ensure the `gh-pages` branch exists and contains the built files
4. Wait a few minutes for GitHub Pages to update after deployment

### Environment Variables

For production deployment, make sure to set up your environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These can be added to GitHub repository secrets for the Actions workflow.