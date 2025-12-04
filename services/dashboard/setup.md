# Dashboard Setup

Deploy the Developer Dashboard to Vercel or your own infrastructure.

## Prerequisites

- Node.js 18+
- pnpm
- Firebase project
- GitHub OAuth app (optional)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/epinnock/scry-developer-dashboard.git
cd scry-developer-dashboard
pnpm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Authentication (optional)
NEXT_PUBLIC_USE_AUTH=false
```

### 3. Run Development Server

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser.

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard

### 2. Enable Services

Enable the following Firebase services:

- **Authentication** - For user login
- **Firestore** - For data storage
- **Storage** - For file uploads (optional)

### 3. Get Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Click "Add app" → Web
4. Copy the configuration values

### 4. Configure Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own projects
    match /projects/{projectId} {
      allow read, write: if request.auth != null
        && resource.data.ownerId == request.auth.uid;
    }

    // Nested collections
    match /projects/{projectId}/{document=**} {
      allow read, write: if request.auth != null;
    }

    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

## GitHub Authentication

### 1. Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** Scry Dashboard
   - **Homepage URL:** `http://localhost:3000` (development)
   - **Authorization callback URL:** Check Firebase Console

### 2. Enable in Firebase

1. Go to Firebase Console → Authentication
2. Click "Sign-in method" tab
3. Enable "GitHub"
4. Enter Client ID and Client Secret from GitHub
5. Copy the callback URL to your GitHub OAuth app

### 3. Enable Auth in Dashboard

```bash
# .env.local
NEXT_PUBLIC_USE_AUTH=true
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

### Manual Deployment

```bash
# Build
pnpm build

# Start production server
pnpm start
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
docker build -t scry-dashboard .
docker run -p 3000:3000 --env-file .env.local scry-dashboard
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase app ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | No | Firebase analytics ID |
| `NEXT_PUBLIC_USE_AUTH` | No | Enable authentication (`true`/`false`) |

## Verification

### Check Firebase Connection

1. Open the dashboard
2. Check browser console for errors
3. Try creating a project

### Check Authentication

1. Click "Sign in with GitHub"
2. Complete OAuth flow
3. Verify user appears in Firebase Console → Authentication

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"

- Verify Firebase configuration values
- Check `NEXT_PUBLIC_FIREBASE_API_KEY` is set correctly

### "GitHub OAuth error"

- Verify callback URL matches in GitHub and Firebase
- Check Client ID and Secret are correct

### "Permission denied" errors

- Update Firestore security rules
- Verify user is authenticated

## Next Steps

- [Firebase Config](/services/dashboard/firebase-config) - Detailed Firebase setup
- [API Keys](/services/dashboard/api-keys) - Managing API keys
- [Architecture](/services/overview) - System architecture
