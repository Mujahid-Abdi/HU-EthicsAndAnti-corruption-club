# Deployment Guide for HU Ethics and Anti-corruption Club Website

This guide provides detailed instructions for deploying the HU Ethics and Anti-corruption Club website.

## Prerequisites

Before deploying, ensure you have:
- Node.js 20.x or later installed
- npm or yarn package manager
- Git installed and configured
- Supabase project credentials

## Deployment Options

### 1. GitHub Pages (Recommended for Simple Deployment)

GitHub Pages provides free hosting for static websites directly from your GitHub repository.

#### Automatic Deployment

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

**Setup Steps:**

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on "Settings"
   - Navigate to "Pages" in the left sidebar
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Configure Secrets**
   - Go to "Settings" > "Secrets and variables" > "Actions"
   - Click "New repository secret"
   - Add the following secrets:
     - `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID
     - `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase publishable (anon) key
     - `VITE_SUPABASE_URL`: Your Supabase project URL

3. **Trigger Deployment**
   - Push changes to the `main` branch, or
   - Go to "Actions" tab and manually trigger the "Deploy to GitHub Pages" workflow

4. **Access Your Site**
   - Your site will be available at: `https://<username>.github.io/HU-EthicsAndAnti-corruption-club/`

#### Troubleshooting GitHub Pages

- If the workflow fails, check the Actions tab for error logs
- Ensure all secrets are properly set
- Verify that GitHub Pages is enabled in repository settings
- Check that the workflow has proper permissions (Settings > Actions > General > Workflow permissions)

### 2. Vercel (Recommended for Production)

Vercel offers excellent performance, automatic SSL, and easy integration with GitHub.

#### Deploy with Vercel Dashboard

1. **Sign up/Login**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or login with your GitHub account

2. **Import Repository**
   - Click "Add New..." > "Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Configure Environment Variables**
   - Add the following environment variables:
     - `VITE_SUPABASE_PROJECT_ID`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
     - `VITE_SUPABASE_URL`

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your site
   - You'll get a URL like `https://your-project.vercel.app`

#### Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project directory
cd HU-EthicsAndAnti-corruption-club

# Deploy
vercel

# Follow the prompts
# For production deployment
vercel --prod
```

### 3. Netlify

Netlify is another excellent option with great developer experience.

#### Deploy with Netlify Dashboard

1. **Sign up/Login**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or login with your GitHub account

2. **Import Repository**
   - Click "Add new site" > "Import an existing project"
   - Choose GitHub and select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These should be auto-detected from `netlify.toml`

4. **Configure Environment Variables**
   - Go to Site settings > Environment variables
   - Add the following:
     - `VITE_SUPABASE_PROJECT_ID`
     - `VITE_SUPABASE_PUBLISHABLE_KEY`
     - `VITE_SUPABASE_URL`

5. **Deploy**
   - Click "Deploy site"
   - You'll get a URL like `https://your-site-name.netlify.app`

#### Deploy with Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Navigate to project directory
cd HU-EthicsAndAnti-corruption-club

# Login
netlify login

# Initialize
netlify init

# Deploy to draft URL
netlify deploy

# Deploy to production
netlify deploy --prod
```

### 4. Other Hosting Providers

The built files in the `dist` directory can be deployed to any static hosting service:

#### Building for Production

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

The `dist` directory will contain all the static files ready for deployment.

#### Popular Alternatives
- **Cloudflare Pages**: Similar to Vercel/Netlify
- **AWS S3 + CloudFront**: More control, requires more setup
- **Firebase Hosting**: Good integration with other Firebase services
- **DigitalOcean App Platform**: Simple deployment from GitHub
- **Render**: Easy static site hosting

## Custom Domain Setup

### GitHub Pages
1. Go to Settings > Pages > Custom domain
2. Enter your domain name
3. Add DNS records at your domain provider:
   - Type: `CNAME`, Host: `www`, Value: `<username>.github.io`
   - Or for apex domain: Type: `A`, Host: `@`, Values: GitHub's IP addresses

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Follow the DNS configuration instructions
4. Vercel will automatically provision SSL

### Netlify
1. Go to Site settings > Domain management
2. Add custom domain
3. Follow the DNS configuration instructions
4. SSL will be automatically provisioned

## Environment Variables

All deployment platforms need these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | `lcqqpdgfduxmgafpifxm` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |

**Security Note**: Never commit the `.env` file to version control. It's already in `.gitignore`.

## Continuous Deployment

All three main platforms support automatic deployments:

- **GitHub Pages**: Deploys automatically via GitHub Actions on push to `main`
- **Vercel**: Automatically deploys when you push to GitHub
- **Netlify**: Automatically deploys when you push to GitHub

You can configure different branches for production and preview deployments in each platform's settings.

## Monitoring and Analytics

Consider adding:
- **Google Analytics**: For visitor tracking
- **Sentry**: For error monitoring
- **Vercel Analytics** or **Netlify Analytics**: Built-in analytics

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm ci`
- Verify Node.js version: `node --version` (should be 20.x+)
- Check build logs for specific errors
- Ensure all environment variables are set

### Site Loads but Doesn't Work
- Check browser console for errors
- Verify environment variables are correctly set
- Check Supabase connection and credentials
- Ensure API endpoints are accessible

### 404 Errors on Refresh
- Verify redirect rules are in place
- For GitHub Pages, ensure proper routing in your React Router setup
- For Vercel/Netlify, the config files (`vercel.json`/`netlify.toml`) should handle this

### Styling Issues
- Clear browser cache
- Verify all CSS files are being loaded
- Check that the build process completed successfully

## Getting Help

- Check GitHub Issues for known problems
- Review deployment platform documentation
- Contact the development team

## Security Considerations

- Keep environment variables secure
- Regularly update dependencies: `npm update`
- Monitor security advisories: `npm audit`
- Use HTTPS for all deployments (automatically handled by modern platforms)
- Review Supabase Row Level Security policies

## Performance Optimization

- Enable Cloudflare or similar CDN
- Optimize images before deployment
- Use lazy loading for components
- Consider code splitting for large bundles
- Enable compression (gzip/brotli) - handled automatically by most platforms

## Rollback Procedure

### GitHub Pages
- Revert the commit in the `main` branch
- The workflow will automatically redeploy the previous version

### Vercel/Netlify
- Go to Deployments
- Find the previous successful deployment
- Click "Rollback to this deployment"

## Maintenance

- Regularly update dependencies
- Monitor site performance
- Check error logs
- Review user feedback
- Keep Supabase and other services updated

## Next Steps

After deployment:
1. Test all functionality
2. Set up monitoring and analytics
3. Configure custom domain (if applicable)
4. Set up SSL/TLS certificate (automatic on most platforms)
5. Create backup and recovery procedures
6. Document any custom configurations
