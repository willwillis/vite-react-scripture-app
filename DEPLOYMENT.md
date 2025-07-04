# GitHub Pages Deployment Guide

This guide will help you deploy your Scripture Notes PWA to GitHub Pages using GitHub Actions.

## Prerequisites

1. Your repository is hosted on GitHub
2. You have admin access to the repository
3. Your main branch is named either `main` or `master`

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### 2. Configure Repository Settings

1. In **Settings** → **Actions** → **General**
2. Ensure **Actions permissions** is set to **Allow all actions and reusable workflows**
3. Under **Workflow permissions**, select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 3. Push Your Code

The GitHub Actions workflow will automatically trigger when you push to the main branch:

```bash
git add .
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

### 4. Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow named "Deploy to GitHub Pages" running
3. Wait for it to complete successfully

### 5. Access Your Site

Once deployment is complete, your site will be available at:
`https://[your-username].github.io/scripture-notes/`

## Manual Deployment

If you need to manually trigger a deployment:

1. Go to the **Actions** tab
2. Select the "Deploy to GitHub Pages" workflow
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Troubleshooting

### Common Issues

1. **Build fails**: Check the Actions logs for specific error messages
2. **Site not accessible**: Ensure GitHub Pages is enabled in repository settings
3. **PWA not working**: Verify the base URL in `vite.config.ts` matches your repository name

### Repository Name Mismatch

If your repository is not named `scripture-notes`, update the base URL in `vite.config.ts`:

```typescript
base: mode === 'production' ? '/your-repo-name/' : '/',
```

## Local Development

For local development, the app will run on the root path (`/`):

```bash
npm run dev
```

For production builds, it will use the repository-specific path (`/scripture-notes/`):

```bash
npm run build
```

## PWA Features

The deployed site includes:
- Progressive Web App capabilities
- Offline functionality
- Install prompts for mobile devices
- Responsive design optimized for all screen sizes 