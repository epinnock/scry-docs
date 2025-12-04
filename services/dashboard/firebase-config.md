# Firebase Configuration

Detailed guide for configuring Firebase for the Developer Dashboard.

## Firebase Project Setup

### 1. Create Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "scry-dashboard")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable "GitHub" provider
3. Configure GitHub OAuth (see below)
4. Save

### 3. Enable Firestore

1. Go to Firestore Database
2. Click "Create database"
3. Choose "Production mode"
4. Select a location (choose closest to your users)
5. Click "Create"

### 4. Get Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Click the web icon (`</>`)
4. Register app with a nickname
5. Copy the configuration object

## Configuration Values

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXX" // optional
};
```

Map these to environment variables:

| Config Key | Environment Variable |
|------------|---------------------|
| `apiKey` | `NEXT_PUBLIC_FIREBASE_API_KEY` |
| `authDomain` | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` |
| `storageBucket` | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `NEXT_PUBLIC_FIREBASE_APP_ID` |
| `measurementId` | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` |

## Firestore Data Structure

### Collections

```
firestore/
├── users/
│   └── {userId}/
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string
│       └── createdAt: Timestamp
│
└── projects/
    └── {projectId}/
        ├── name: string
        ├── description: string
        ├── ownerId: string
        ├── createdAt: Timestamp
        │
        ├── builds/
        │   └── {buildId}/
        │       ├── versionId: string
        │       ├── buildNumber: number
        │       ├── zipUrl: string
        │       ├── status: string
        │       └── createdAt: Timestamp
        │
        ├── apiKeys/
        │   └── {keyId}/
        │       ├── name: string
        │       ├── prefix: string
        │       ├── hash: string
        │       ├── status: string
        │       └── createdAt: Timestamp
        │
        └── counters/
            └── builds/
                └── currentBuildNumber: number
```

## Security Rules

### Basic Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(ownerId) {
      return request.auth.uid == ownerId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId;
    }

    // Projects collection
    match /projects/{projectId} {
      allow read: if isSignedIn() && isOwner(resource.data.ownerId);
      allow create: if isSignedIn();
      allow update, delete: if isSignedIn() && isOwner(resource.data.ownerId);

      // Nested builds collection
      match /builds/{buildId} {
        allow read: if isSignedIn();
        allow write: if isSignedIn();
      }

      // Nested apiKeys collection
      match /apiKeys/{keyId} {
        allow read: if isSignedIn();
        allow write: if isSignedIn();
      }

      // Nested counters collection
      match /counters/{counterId} {
        allow read, write: if isSignedIn();
      }
    }
  }
}
```

### Production Rules

For stricter security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isProjectOwner(projectId) {
      return isSignedIn() &&
        get(/databases/$(database)/documents/projects/$(projectId)).data.ownerId == request.auth.uid;
    }

    // Users
    match /users/{userId} {
      allow read: if isSignedIn() && request.auth.uid == userId;
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isSignedIn() && request.auth.uid == userId;
    }

    // Projects
    match /projects/{projectId} {
      allow read: if isProjectOwner(projectId);
      allow create: if isSignedIn() &&
        request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if isProjectOwner(projectId);

      // Builds - service account can write, owners can read
      match /builds/{buildId} {
        allow read: if isProjectOwner(projectId);
        allow create: if isSignedIn(); // Upload service creates builds
      }

      // API Keys
      match /apiKeys/{keyId} {
        allow read: if isProjectOwner(projectId);
        allow create: if isProjectOwner(projectId);
        allow update: if isProjectOwner(projectId) &&
          request.resource.data.diff(resource.data).affectedKeys()
            .hasOnly(['status', 'revokedAt', 'revokedBy']);
      }

      // Counters
      match /counters/{counterId} {
        allow read: if isProjectOwner(projectId);
        allow update: if isSignedIn(); // Upload service increments
      }
    }
  }
}
```

## Indexes

Create these indexes in Firestore:

### Projects by Owner

```
Collection: projects
Fields: ownerId (Ascending), createdAt (Descending)
```

### Builds by Project

```
Collection: projects/{projectId}/builds
Fields: createdAt (Descending)
```

### API Keys by Status

```
Collection: projects/{projectId}/apiKeys
Fields: status (Ascending), createdAt (Descending)
```

## Service Account

For server-side access (Upload Service, CDN Service):

### 1. Generate Key

1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Save the JSON file securely

### 2. Use in Services

**Node.js:**

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
```

**Cloudflare Workers:**

Extract and set as secrets:

```bash
wrangler secret put FIREBASE_PROJECT_ID
wrangler secret put FIREBASE_CLIENT_EMAIL
wrangler secret put FIREBASE_PRIVATE_KEY
```

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Name:** Scry Dashboard
   - **Homepage URL:** Your dashboard URL
   - **Callback URL:** From Firebase Console

### 2. Configure in Firebase

1. Go to Authentication → Sign-in method → GitHub
2. Enable GitHub
3. Enter Client ID and Client Secret
4. Note the callback URL
5. Add callback URL to GitHub OAuth app
6. Save

## Troubleshooting

### "Permission denied"

- Check Firestore rules
- Verify user is authenticated
- Check `ownerId` matches authenticated user

### "Invalid API key"

- Verify `NEXT_PUBLIC_FIREBASE_API_KEY`
- Check API key restrictions in Google Cloud Console

### "Auth domain not authorized"

- Add your domain to Firebase → Authentication → Settings → Authorized domains

## Next Steps

- [Dashboard Setup](/services/dashboard/setup) - Complete setup guide
- [API Keys](/services/dashboard/api-keys) - Managing API keys
- [Upload Service](/services/upload-service/) - Backend configuration
