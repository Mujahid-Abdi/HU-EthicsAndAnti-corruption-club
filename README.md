# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project includes multiple deployment options:

### Option 1: GitHub Pages (Automated)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages.

**Setup Steps:**

1. Go to your repository settings on GitHub
2. Navigate to Settings > Pages
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Go to Settings > Secrets and variables > Actions
5. Add the following secrets:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
6. Push to the `main` branch or manually trigger the workflow

The site will be automatically deployed to: `https://<username>.github.io/HU-EthicsAndAnti-corruption-club/`

### Option 2: Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Mujahid-Abdi/HU-EthicsAndAnti-corruption-club)

**Manual Deployment:**

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`

### Option 3: Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Mujahid-Abdi/HU-EthicsAndAnti-corruption-club)

**Manual Deployment:**

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. Follow the prompts
4. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`

### Option 4: Lovable

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

### Manual Build

To build the project manually:

```sh
npm run build
```

The built files will be in the `dist` directory. You can then upload these files to any static hosting service.

## Environment Variables

Make sure to set the following environment variables in your deployment platform:

- `VITE_SUPABASE_PROJECT_ID`: Your Supabase project ID
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase publishable key
- `VITE_SUPABASE_URL`: Your Supabase URL

## Can I connect a custom domain?

Yes! Most deployment platforms support custom domains:

- **GitHub Pages**: Go to Settings > Pages > Custom domain
- **Vercel**: Go to Project Settings > Domains
- **Netlify**: Go to Site Settings > Domain management
- **Lovable**: Navigate to Project > Settings > Domains

Read more about custom domains:
- [GitHub Pages Custom Domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Vercel Custom Domain](https://vercel.com/docs/concepts/projects/domains)
- [Netlify Custom Domain](https://docs.netlify.com/domains-https/custom-domains/)
- [Lovable Custom Domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
