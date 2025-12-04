# Partial ZIP Extraction

The CDN Service uses partial ZIP extraction to serve files efficiently without downloading entire archives.

## Why Partial Extraction?

Traditional approach:
```
1. Download entire ZIP (e.g., 50 MB)
2. Extract all files to disk
3. Serve requested file
4. Repeat for each request
```

Partial extraction:
```
1. Read ZIP central directory (~1 KB)
2. Locate requested file
3. Download only that file's bytes
4. Decompress and serve
```

**Benefits:**
- ~50x less data transfer
- Faster response times
- Lower storage costs
- Works with any file in the archive

## How ZIP Files Work

A ZIP file has this structure:

```
┌─────────────────────────────────────────┐
│  Local File Header 1                    │
│  File Data 1 (compressed)               │
├─────────────────────────────────────────┤
│  Local File Header 2                    │
│  File Data 2 (compressed)               │
├─────────────────────────────────────────┤
│  ... more files ...                     │
├─────────────────────────────────────────┤
│  Central Directory                      │  ← Index of all files
│  ├─ Entry 1: name, offset, size, etc.   │
│  ├─ Entry 2: name, offset, size, etc.   │
│  └─ ... more entries ...                │
├─────────────────────────────────────────┤
│  End of Central Directory               │  ← Points to Central Directory
└─────────────────────────────────────────┘
```

Key insight: The **Central Directory** at the end contains metadata for all files, including their offsets within the archive.

## Extraction Process

### Step 1: Find End of Central Directory

Read the last 22+ bytes of the ZIP:

```typescript
const eocdr = await fetchRange(zipPath, -22);
const cdOffset = parseEOCDR(eocdr);
```

### Step 2: Load Central Directory

Fetch just the central directory:

```typescript
const centralDirectory = await fetchRange(zipPath, cdOffset, cdLength);
const entries = parseCentralDirectory(centralDirectory);
```

### Step 3: Find File Entry

Look up the requested file:

```typescript
const entry = entries.find(e => e.filename === requestedPath);
// entry: { filename, offset, compressedSize, uncompressedSize, method }
```

### Step 4: Fetch File Data

Download only the file's bytes:

```typescript
const fileData = await fetchRange(
  zipPath,
  entry.offset + localHeaderSize,
  entry.compressedSize
);
```

### Step 5: Decompress

If the file is deflate-compressed:

```typescript
if (entry.method === 8) { // DEFLATE
  return pako.inflate(fileData);
} else { // STORED (no compression)
  return fileData;
}
```

## Range Requests

The CDN uses HTTP range requests to fetch specific bytes:

```typescript
const response = await r2.get(key, {
  range: {
    offset: startByte,
    length: numBytes
  }
});
```

This is supported by:
- Cloudflare R2
- AWS S3
- Most object storage providers

## Caching Strategy

### Central Directory Caching

The central directory is cached in Cloudflare KV:

```typescript
const cacheKey = `cd:${projectId}.zip`;

// Try cache first
let cd = await kv.get(cacheKey, 'json');

if (!cd) {
  // Load from R2
  cd = await loadCentralDirectory(projectId);

  // Cache for 24 hours
  await kv.put(cacheKey, JSON.stringify(cd), {
    expirationTtl: 86400
  });
}
```

### Why Cache the Central Directory?

- It's read for every file request
- It's typically small (~1-10 KB)
- It doesn't change unless the ZIP is updated
- KV access is ~10x faster than R2

### Cache Invalidation

When a new ZIP is uploaded:

1. **Automatic:** Cache expires after 24 hours
2. **Manual:** Call `clearCentralDirectoryCache(projectId)`

```typescript
async function clearCentralDirectoryCache(projectId: string) {
  await kv.delete(`cd:${projectId}.zip`);
}
```

## Compression Methods

ZIP supports several compression methods:

| Method | Code | Description |
|--------|------|-------------|
| STORED | 0 | No compression |
| DEFLATE | 8 | Standard compression |
| BZIP2 | 12 | Higher compression (rare) |

We support STORED and DEFLATE, which covers 99% of ZIP files.

### Decompression

Using the `pako` library:

```typescript
import pako from 'pako';

function decompress(data: Uint8Array, method: number): Uint8Array {
  if (method === 0) {
    return data; // STORED - no decompression needed
  }
  if (method === 8) {
    return pako.inflateRaw(data); // DEFLATE
  }
  throw new Error(`Unsupported compression method: ${method}`);
}
```

## Implementation Details

### R2 Range Reader

Custom reader for `unzipit` library:

```typescript
class R2RangeReader {
  constructor(private bucket: R2Bucket, private key: string) {}

  async getLength(): Promise<number> {
    const head = await this.bucket.head(this.key);
    return head?.size ?? 0;
  }

  async read(offset: number, length: number): Promise<Uint8Array> {
    const response = await this.bucket.get(this.key, {
      range: { offset, length }
    });
    return new Uint8Array(await response!.arrayBuffer());
  }
}
```

### Central Directory Parser

Parsing the central directory:

```typescript
interface CDEntry {
  filename: string;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
  compressionMethod: number;
}

function parseCentralDirectory(data: ArrayBuffer): CDEntry[] {
  const view = new DataView(data);
  const entries: CDEntry[] = [];

  let offset = 0;
  while (offset < data.byteLength) {
    // Check signature
    if (view.getUint32(offset, true) !== 0x02014b50) break;

    // Parse entry
    entries.push({
      compressionMethod: view.getUint16(offset + 10, true),
      compressedSize: view.getUint32(offset + 20, true),
      uncompressedSize: view.getUint32(offset + 24, true),
      filenameLength: view.getUint16(offset + 28, true),
      localHeaderOffset: view.getUint32(offset + 42, true),
      // ... parse filename
    });

    offset += 46 + filenameLength + extraLength + commentLength;
  }

  return entries;
}
```

## Performance Metrics

| Operation | Typical Time |
|-----------|--------------|
| KV lookup | ~5ms |
| R2 range request | ~20-50ms |
| Decompression | ~1-5ms |
| **Total (cache hit)** | **~30ms** |
| **Total (cache miss)** | **~60ms** |

## Limitations

### Maximum File Size

- Individual files: 100 MB
- Total ZIP size: No hard limit (partial extraction)

### Unsupported Features

- ZIP64 extensions (for very large archives)
- Encrypted ZIPs
- BZIP2/LZMA compression

### Edge Cases

- Empty directories in ZIP
- Symbolic links
- File permissions

## Troubleshooting

### "Unsupported compression method"

The file uses a compression method we don't support. Re-zip with standard DEFLATE:

```bash
zip -r archive.zip directory/
```

### "Central directory not found"

The ZIP file may be corrupted or truncated. Re-upload the file.

### "File not found in archive"

Check the path within the ZIP. Paths are case-sensitive.

## Next Steps

- [Architecture](/services/cdn-service/architecture) - Overall system design
- [Subdomain Routing](/services/cdn-service/subdomain-routing) - URL routing
- [Deployment](/services/cdn-service/deployment) - Self-hosting guide
