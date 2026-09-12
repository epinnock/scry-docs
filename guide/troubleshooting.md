# Troubleshooting

> Common issues and their solutions when using Scry.

## Init Command Issues

### "Not a git repository"

**Problem:** The init command fails with "Not a git repository".

**Solution:** Initialize git first:

```bash
git init
git remote add origin https://github.com/your-username/your-repo.git
```

### "GitHub CLI not found"

**Problem:** The command can't find the GitHub CLI.

**Solution:** Install and authenticate GitHub CLI:

::: code-group

```bash [macOS]
brew install gh
gh auth login
```

```bash [Ubuntu/Debian]
sudo apt install gh
gh auth login
```

```bash [Windows]
winget install --id GitHub.cli
gh auth login
```

:::

Or skip GitHub CLI setup:

```bash
npx @scry/storybook-deployer init \
  --projectId YOUR_PROJECT_ID \
  --apiKey YOUR_API_KEY \
  --skip-gh-setup
```

Then manually add variables in **Settings → Secrets and variables → Actions**.

### "Git push fails with Authentication failed"

**Problem:** Can't push to GitHub.

**Solution:** Configure Git credentials:

```bash
# For HTTPS
gh auth setup-git

# Or use SSH
git remote set-url origin git@github.com:your-username/your-repo.git
```

### "No build command found"

**Problem:** Warning about missing build command.

**Solution:** Add a build script to `package.json`:

```json
{
  "scripts": {
    "build-storybook": "storybook build"
  }
}
```

## Deployment Issues

### "Directory not found"

**Problem:** The specified Storybook directory doesn't exist.

**Solution:** Build Storybook first:

```bash
npm run build-storybook
ls -la ./storybook-static  # Verify it exists
```

### "Authentication failed" (401)

**Problem:** API key is invalid or missing.

**Solution:** Verify your API key:

```bash
# Check environment variable
echo $STORYBOOK_DEPLOYER_API_KEY

# Should start with scry_proj_
```

Ensure the key:
- Starts with `scry_proj_`
- Hasn't been revoked
- Matches the project

### "Project mismatch" (403)

**Problem:** API key doesn't match the project.

**Solution:**
- Verify you're using the correct API key for the project
- Check the project ID in your configuration
- Generate a new API key from the dashboard

### "Upload failed"

**Problem:** File upload to storage failed.

**Solution:**
1. Check your network connection
2. Retry the deployment
3. Check if the file size is within limits

```bash
# Check file size
du -h storybook-static/

# Retry with verbose logging
npx @scry/storybook-deployer --dir ./storybook-static --verbose
```

### "Timeout" errors

**Problem:** Deployment times out.

**Solution:**
- Reduce Storybook build size
- Check network connectivity
- Try again later (may be a transient issue)

## GitHub Actions Issues

### "Workflow not triggered"

**Problem:** Push doesn't trigger the workflow.

**Solution:** Verify:
1. Workflow file is in `.github/workflows/`
2. File has `.yml` or `.yaml` extension
3. Branch name matches trigger conditions
4. GitHub Actions is enabled for the repository

```yaml
# Check trigger configuration
on:
  push:
    branches: [main]  # Must match your branch name
```

### "Secrets not available"

**Problem:** Secrets are undefined in the workflow.

**Solution:**
- Secrets aren't available in forks by default
- Check secret names match exactly (case-sensitive)
- Verify secrets are set at repository level

```yaml
# Correct usage
${{ secrets.SCRY_API_KEY }}  # Not $SCRY_API_KEY
```

### "Build fails"

**Problem:** Storybook build fails in CI.

**Solution:**
1. Ensure `build-storybook` script exists
2. Check Node.js version matches local development
3. Verify all dependencies are installed

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'  # Match your local version
    cache: 'npm'

- run: npm ci  # Clean install
```

### "PR comment not posted"

**Problem:** No comment appears on pull requests.

**Solution:** Check workflow permissions:

```yaml
permissions:
  contents: read
  pull-requests: write  # Required for comments
```

## CDN/Viewing Issues

### "404 Not Found"

**Problem:** Deployed Storybook returns 404.

**Solution:**
- Verify the deployment completed successfully
- Check the URL format: `https://view.scrymore.com/{project}/{version}/`
- Ensure `index.html` exists in your build

### "Old version displayed"

**Problem:** Changes aren't reflected.

**Solution:**
- Hard refresh the page (Ctrl+Shift+R)
- Clear browser cache
- Check that the latest deployment succeeded

### "CORS errors"

**Problem:** Browser shows CORS errors.

**Solution:**
- CORS should be handled by the CDN
- Check if you're accessing from an allowed origin
- Report persistent issues

## Configuration Issues

### "Config file not found"

**Problem:** CLI can't find `.storybook-deployer.json`.

**Solution:** Run init or create manually:

```bash
# Run init
npx @scry/storybook-deployer init --projectId xxx --apiKey yyy

# Or create manually
cat > .storybook-deployer.json << EOF
{
  "apiUrl": "https://upload.scrymore.com",
  "project": "my-project",
  "dir": "./storybook-static"
}
EOF
```

### "Environment variables not working"

**Problem:** Environment variables are ignored.

**Solution:** Check naming and format:

```bash
# Correct format
export STORYBOOK_DEPLOYER_PROJECT=my-project
export SCRY_PROJECT_ID=my-project  # Alternative prefix

# CLI flags override environment variables
npx storybook-deploy --project other-project  # This wins
```

## Getting Help

If you can't resolve your issue:

1. **Search existing issues:** [GitHub Issues](https://github.com/epinnock/scry-node/issues)
2. **Tell us directly:** [feedback form](/feedback) or <feedback@scrymore.com>
3. **Open a new issue** with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Verbose output (`--verbose` flag)

## Diagnostic Commands

```bash
# Check CLI version
npx @scry/storybook-deployer --version

# Verify Node.js version
node --version

# Check git configuration
git remote -v
git status

# Test API connectivity
curl -I https://upload.scrymore.com/health

# Verbose deployment
npx @scry/storybook-deployer --dir ./storybook-static --verbose
```
