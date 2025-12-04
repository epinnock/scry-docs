# Firebase Setup

Configure Firebase for authentication and data storage.

## Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter project name (e.g., `scry-self-hosted`)
4. Disable Google Analytics (optional)
5. Click **Create project**

## Enable Firestore

### Create Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode**
4. Choose a region (closest to your users)
5. Click **Create**

### Configure Security Rules

Go to Firestore → Rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(ownerId) {
      return request.auth.uid == ownerId;
    }

    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if isSignedIn() && request.auth.uid == userId;
    }

    // Projects - owner access only
    match /projects/{projectId} {
      allow read: if isSignedIn() && isOwner(resource.data.ownerId);
      allow create: if isSignedIn() && request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if isSignedIn() && isOwner(resource.data.ownerId);

      // Builds - service can create, owner can read
      match /builds/{buildId} {
        allow read: if isSignedIn();
        allow create: if isSignedIn();
      }

      // API Keys - owner only
      match /apiKeys/{keyId} {
        allow read: if isSignedIn();
        allow create: if isSignedIn();
        allow update: if isSignedIn();
      }

      // Counters - service can update
      match /counters/{counterId} {
        allow read, write: if isSignedIn();
      }
    }
  }
}
```

Click **Publish**.

### Create Indexes

Go to Firestore → Indexes → Add Index:

**Index 1: Projects by owner**
- Collection: `projects`
- Fields:
  - `ownerId` (Ascending)
  - `createdAt` (Descending)

**Index 2: Builds by date**
- Collection: `projects/{projectId}/builds`
- Fields:
  - `createdAt` (Descending)

## Enable Authentication

### Configure Sign-in Methods

1. Go to **Authentication** → **Sign-in method**
2. Click **GitHub**
3. Toggle **Enable**
4. Note the **Authorization callback URL**
5. Leave Client ID/Secret empty for now

### Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click **New OAuth App**
3. Fill in:
   - **Application name:** Scry Dashboard
   - **Homepage URL:** Your dashboard URL
   - **Authorization callback URL:** (from Firebase)
4. Click **Register application**
5. Copy **Client ID**
6. Click **Generate a new client secret**
7. Copy **Client Secret**

### Complete GitHub Setup in Firebase

1. Back in Firebase → Authentication → GitHub
2. Paste Client ID
3. Paste Client Secret
4. Click **Save**

### Add Authorized Domains

1. Go to Authentication → Settings
2. Under **Authorized domains**, add:
   - `localhost` (for development)
   - Your dashboard domain

## Generate Service Account

For server-side access (Upload Service):

1. Go to **Project Settings** → **Service accounts**
2. Click **Generate new private key**
3. Click **Generate key**
4. Save the JSON file as `serviceAccount.json`

### Extract Values for Workers

The Upload Service needs these values from the JSON:

```javascript
// serviceAccount.json
{
  "project_id": "your-project-id",
  "client_email": "firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

Set as Wrangler secrets:

```bash
wrangler secret put FIREBASE_PROJECT_ID
# Enter: your-project-id

wrangler secret put FIREBASE_CLIENT_EMAIL
# Enter: firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

wrangler secret put FIREBASE_PRIVATE_KEY
# Enter the entire private_key value including \n characters
```

## Get Web Configuration

For the Dashboard:

1. Go to **Project Settings** → **General**
2. Scroll to **Your apps**
3. Click the web icon (`</>`)
4. Register app with nickname (e.g., "Dashboard")
5. Copy the configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Dashboard Environment Variables

Create `.env.local` in the dashboard project:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_USE_AUTH=true
```

## Verification

### Test Firestore

1. Go to Firestore → Data
2. Click **Start collection**
3. Collection ID: `test`
4. Document ID: Auto-ID
5. Add a field and save
6. Delete the test collection

### Test Authentication

1. Run the dashboard locally:
   ```bash
   pnpm dev
   ```
2. Click "Sign in with GitHub"
3. Complete OAuth flow
4. Check Authentication → Users in Firebase Console

### Test Service Account

Create a test script:

```javascript
// test-firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function test() {
  const doc = await db.collection('test').add({
    message: 'Hello from service account',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log('Created document:', doc.id);
  await doc.delete();
  console.log('Test successful!');
}

test().catch(console.error);
```

Run:

```bash
node test-firebase.js
```

## Cost Monitoring

### Free Tier Limits

| Resource | Free Limit |
|----------|------------|
| Firestore Reads | 50,000/day |
| Firestore Writes | 20,000/day |
| Firestore Deletes | 20,000/day |
| Firestore Storage | 1 GB |
| Authentication | 50,000 MAU |

### Set Budget Alerts

1. Go to Firebase Console → Usage and billing
2. Click **Modify plan**
3. Set up budget alerts

## Troubleshooting

### "Permission denied"

- Check Firestore rules are published
- Verify user is authenticated
- Check `ownerId` matches user UID

### "Invalid API key"

- Verify `NEXT_PUBLIC_FIREBASE_API_KEY`
- Check for typos or extra whitespace
- Ensure key hasn't been restricted

### "GitHub auth failed"

- Verify callback URL matches exactly
- Check Client ID and Secret are correct
- Ensure GitHub provider is enabled

### "Service account error"

- Verify JSON file is valid
- Check private key includes `\n` characters
- Ensure project ID matches

## Next Steps

- [Cloudflare Setup](/self-hosting/cloudflare) - Storage and CDN
- [Complete Setup](/self-hosting/complete-setup) - Full deployment
- [Vercel Deployment](/self-hosting/vercel) - Dashboard hosting
