# Upload Service API Reference

## Base URL

- **Production:** `https://upload.scrymore.com`
- **Self-hosted:** Your deployment URL

## Authentication

Protected endpoints require an `X-API-Key` header:

```http
X-API-Key: scry_proj_my-project_your-api-key-here
```

## Endpoints

### Health

```http
GET /health
GET /healthz
```

`/healthz` carries the deploy stamp — commit, branch, build time and environment — which is what to check when you need to know *which* build answered.

---

### Direct upload

Upload a zipped Storybook build in one request.

```http
POST /upload/:project/:version
```

Stores the archive and creates the build record, then publishes a build event so processing can index it. **Storing and queueing are separate effects**: a success means the archive is stored, and the build record's status tells you whether processing was scheduled.

---

### Presigned upload

Get a short-lived URL and upload straight to storage, bypassing the service.

```http
POST /presigned-url/:project/:version/:filename
```

Preferred for large archives — the file never passes through the Worker.

---

### Build metadata

```http
GET  /upload/:project/:version
POST /upload/:project/:version/metadata
```

`GET` returns the build record. `POST .../metadata` attaches the story metadata the capture step produced, which is what later makes stories searchable.

---

### Coverage

```http
POST /upload/:project/:version/coverage
```

Attaches a Storybook coverage report to the build.

---

### Images

```http
POST /upload-images/:project
POST /upload-images/:project/complete
```

Multi-part image upload: post images, then signal completion so they are attached to the project as a set.

---

### Cleanup

```http
DELETE /cleanup/:project/:version
```

Removes a build's stored artifacts. Guarded by `CLEANUP_TOKEN` rather than a project API key, because it is destructive and not something CI should hold a credential for.

---

### Interactive docs

```http
GET /docs
GET /openapi.json
```

The service is defined with OpenAPI, so `/docs` serves Swagger UI against the live schema. When this page and the schema disagree, the schema is right.
