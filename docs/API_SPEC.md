# FileForge API Specification

> **Version:** 1.0.0
> **Base URL:** `http://localhost:3000`
> **Stack:** TypeScript + Bun + Hono
> **Storage Policy:** Stateless — no data is stored on the server. All files are processed in-memory and returned immediately.

---

## Table of Contents

- [General Notes](#general-notes)
- [Common Error Responses](#common-error-responses)
- [Utility Endpoints](#utility-endpoints)
- [PDF Endpoints](#pdf-endpoints)
  - [Convert FROM PDF](#convert-from-pdf)
  - [Convert TO PDF](#convert-to-pdf)
  - [PDF Manipulation](#pdf-manipulation)
- [Image Endpoints](#image-endpoints)
  - [Convert](#image-convert)
  - [Manipulate](#image-manipulate)
- [Document Endpoints](#document-endpoints)

---

## General Notes

- All file uploads use `multipart/form-data` with the field name `file` (or `files` for multiple)
- All responses that return a file include proper `Content-Type` and `Content-Disposition` headers
- No data is persisted — every request is fully synchronous and self-contained
- Maximum file size: **50MB** per file
- Query parameters are used for fine-tuning conversion options

---

## Common Error Responses

These apply across **all** endpoints.

**`400` — No file provided**
```json
{
  "error": "No file provided"
}
```

**`400` — File too large**
```json
{
  "error": "File exceeds maximum allowed size",
  "maxSize": "50MB",
  "receivedSize": "120MB"
}
```

**`400` — Wrong file type**
```json
{
  "error": "Uploaded file is not a PDF",
  "detected": "image/png"
}
```

**`415` — Unsupported media type**
```json
{
  "error": "Unsupported media type",
  "received": "application/zip"
}
```

**`500` — Internal server error**
```json
{
  "error": "Internal server error",
  "message": "Failed to process file",
  "requestId": "req_abc123"
}
```

---

## Utility Endpoints

### `GET /health`

Simple check to confirm the API is alive and running.

**Request**
```http
GET /health
```

**Response `200`**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-06-14T10:00:00.000Z"
}
```

---

### `GET /formats`

Returns all supported input and output formats grouped by category.

**Request**
```http
GET /formats
```

**Response `200`**
```json
{
  "pdf": {
    "input": ["pdf"],
    "output": ["png", "jpeg", "webp", "docx", "html", "txt"]
  },
  "image": {
    "input": ["png", "jpeg", "webp", "gif", "bmp", "tiff"],
    "output": ["png", "jpeg", "webp", "gif", "bmp", "tiff", "pdf"]
  },
  "document": {
    "input": ["docx", "xlsx", "csv", "json", "html", "txt"],
    "output": ["pdf", "txt", "html", "csv", "json", "xlsx"]
  }
}
```

---

### `POST /detect`

Detects the real file type from its binary content — not just the extension or MIME type sent by the client.

**Request**
```http
POST /detect
Content-Type: multipart/form-data

file: <any file>
```

**Response `200`**
```json
{
  "detected": {
    "mimeType": "application/pdf",
    "format": "pdf",
    "extension": "pdf",
    "category": "document"
  },
  "claimed": {
    "mimeType": "application/pdf",
    "filename": "sample.pdf"
  },
  "mismatch": false
}
```

> `mismatch: true` when the actual file type differs from what the client claimed — e.g. a `.pdf` file that is actually a PNG binary.

**Response `400`** — no file uploaded
```json
{
  "error": "No file provided"
}
```

---

### `POST /validate/pdf`

Deeply inspects a PDF to check if it's valid, readable, corrupted, or password-protected.

**Request**
```http
POST /validate/pdf
Content-Type: multipart/form-data

file: <pdf file>
```

**Response `200` — valid PDF**
```json
{
  "valid": true,
  "pageCount": 5,
  "encrypted": false,
  "version": "1.7",
  "fileSize": 204800,
  "issues": []
}
```

**Response `200` — password-protected**
```json
{
  "valid": true,
  "pageCount": null,
  "encrypted": true,
  "version": "1.7",
  "fileSize": 102400,
  "issues": ["PDF is password-protected, cannot read contents without decryption"]
}
```

**Response `200` — corrupted**
```json
{
  "valid": false,
  "pageCount": null,
  "encrypted": false,
  "version": null,
  "fileSize": 512,
  "issues": [
    "PDF header is missing or malformed",
    "File may be truncated or corrupted"
  ]
}
```

**Response `400`** — wrong file type
```json
{
  "error": "Uploaded file is not a PDF",
  "detected": "image/png"
}
```

---

### `POST /validate/image`

Checks if an image file is valid and returns its properties.

**Request**
```http
POST /validate/image
Content-Type: multipart/form-data

file: <image file>
```

**Response `200` — valid image**
```json
{
  "valid": true,
  "format": "png",
  "width": 1920,
  "height": 1080,
  "channels": 4,
  "colorSpace": "sRGB",
  "hasAlpha": true,
  "fileSize": 512000,
  "issues": []
}
```

**Response `200` — corrupted image**
```json
{
  "valid": false,
  "format": "jpeg",
  "width": null,
  "height": null,
  "channels": null,
  "colorSpace": null,
  "hasAlpha": null,
  "fileSize": 1024,
  "issues": [
    "Image data is truncated or corrupted",
    "Cannot read pixel dimensions"
  ]
}
```

**Response `400`** — unsupported format
```json
{
  "error": "Unsupported image format",
  "detected": "application/pdf",
  "supported": ["png", "jpeg", "webp", "gif", "bmp", "tiff"]
}
```

---

## PDF Endpoints

### Convert FROM PDF

---

#### `POST /pdf/to/image`

Converts a PDF page to an image.

**Request**
```http
POST /pdf/to/image?page=1&format=png&dpi=150
Content-Type: multipart/form-data

file: <pdf file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number to convert |
| `format` | string | `png` | Output format: `png`, `jpeg`, `webp` |
| `dpi` | number | `150` | Resolution (dots per inch) |

**Response `200`**
```http
Content-Type: image/png
Content-Disposition: attachment; filename="output.png"

<binary image data>
```

**Response `400`** — invalid page number
```json
{
  "error": "Page number out of range",
  "requested": 10,
  "totalPages": 5
}
```

---

#### `POST /pdf/to/text`

Extracts all text content from a PDF.

**Request**
```http
POST /pdf/to/text
Content-Type: multipart/form-data

file: <pdf file>
```

**Response `200`**
```json
{
  "text": "This is the extracted text content from the PDF...",
  "pageCount": 5,
  "characterCount": 4821
}
```

**Response `200` — encrypted PDF**
```json
{
  "error": "PDF is encrypted and cannot be read without a password",
  "encrypted": true
}
```

---

#### `POST /pdf/to/docx`

Converts a PDF to a Word document.

**Request**
```http
POST /pdf/to/docx
Content-Type: multipart/form-data

file: <pdf file>
```

**Response `200`**
```http
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename="output.docx"

<binary docx data>
```

---

#### `POST /pdf/to/html`

Converts a PDF to an HTML file preserving structure and layout.

**Request**
```http
POST /pdf/to/html
Content-Type: multipart/form-data

file: <pdf file>
```

**Response `200`**
```http
Content-Type: text/html
Content-Disposition: attachment; filename="output.html"

<html content>
```

---

### Convert TO PDF

---

#### `POST /pdf/from/image`

Converts an image (PNG, JPEG, WEBP) into a PDF.

**Request**
```http
POST /pdf/from/image
Content-Type: multipart/form-data

file: <image file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `fit` | string | `cover` | How image fits the page: `cover`, `contain`, `fill` |
| `pageSize` | string | `a4` | Page size: `a4`, `letter`, `legal` |

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="output.pdf"

<binary pdf data>
```

---

#### `POST /pdf/from/docx`

Converts a Word document into a PDF.

**Request**
```http
POST /pdf/from/docx
Content-Type: multipart/form-data

file: <docx file>
```

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="output.pdf"

<binary pdf data>
```

---

#### `POST /pdf/from/html`

Converts an HTML file or raw HTML string into a PDF.

**Request**
```http
POST /pdf/from/html?pageSize=a4&margin=20
Content-Type: multipart/form-data

file: <html file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `pageSize` | string | `a4` | Page size: `a4`, `letter`, `legal` |
| `margin` | number | `20` | Page margin in pixels |
| `orientation` | string | `portrait` | `portrait` or `landscape` |

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="output.pdf"

<binary pdf data>
```

---

#### `POST /pdf/from/text`

Converts plain text into a PDF.

**Request**
```http
POST /pdf/from/text
Content-Type: multipart/form-data

file: <txt file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `fontSize` | number | `12` | Font size in pt |
| `fontFamily` | string | `helvetica` | Font: `helvetica`, `courier`, `times` |
| `pageSize` | string | `a4` | Page size: `a4`, `letter`, `legal` |

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="output.pdf"

<binary pdf data>
```

---

### PDF Manipulation

---

#### `POST /pdf/merge`

Merges multiple PDF files into a single PDF in the order they are uploaded.

**Request**
```http
POST /pdf/merge
Content-Type: multipart/form-data

files: <pdf file 1>
files: <pdf file 2>
files: <pdf file 3>
```

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="merged.pdf"

<binary pdf data>
```

**Response `400`** — less than 2 files
```json
{
  "error": "At least 2 PDF files are required for merging",
  "received": 1
}
```

---

#### `POST /pdf/split`

Splits a PDF into multiple PDFs by page ranges. Returns a ZIP archive.

**Request**
```http
POST /pdf/split?pages=1-3,5,7-9
Content-Type: multipart/form-data

file: <pdf file>
```

| Query Param | Type | Required | Description |
|---|---|---|---|
| `pages` | string | ✅ | Comma-separated page ranges e.g. `1-3,5,7-9` |

**Response `200`**
```http
Content-Type: application/zip
Content-Disposition: attachment; filename="split.zip"

<binary zip data>
```

**Response `400`** — invalid page range
```json
{
  "error": "Invalid page range",
  "requested": "1-3,5,99",
  "totalPages": 10
}
```

---

#### `POST /pdf/compress`

Reduces the file size of a PDF.

**Request**
```http
POST /pdf/compress?quality=medium
Content-Type: multipart/form-data

file: <pdf file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `quality` | string | `medium` | Compression level: `low`, `medium`, `high` |

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="compressed.pdf"

<binary pdf data>
```

**Response `200` headers include:**
```http
X-Original-Size: 5242880
X-Compressed-Size: 1048576
X-Compression-Ratio: 80%
```

---

#### `POST /pdf/rotate`

Rotates all or specific pages of a PDF.

**Request**
```http
POST /pdf/rotate?degrees=90&pages=1,3,5
Content-Type: multipart/form-data

file: <pdf file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `degrees` | number | `90` | Rotation: `90`, `180`, `270` |
| `pages` | string | all | Comma-separated page numbers to rotate |

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="rotated.pdf"

<binary pdf data>
```

---

#### `POST /pdf/extract-pages`

Extracts specific pages from a PDF into a new PDF.

**Request**
```http
POST /pdf/extract-pages?pages=1,3,5-8
Content-Type: multipart/form-data

file: <pdf file>
```

| Query Param | Type | Required | Description |
|---|---|---|---|
| `pages` | string | ✅ | Comma-separated page numbers or ranges |

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="extracted.pdf"

<binary pdf data>
```

---

#### `POST /pdf/watermark`

Adds a text or image watermark to all pages of a PDF.

**Request**
```http
POST /pdf/watermark?text=CONFIDENTIAL&opacity=0.3&position=center
Content-Type: multipart/form-data

file: <pdf file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `text` | string | — | Watermark text (use either `text` or `image`) |
| `opacity` | number | `0.3` | Opacity between `0.0` and `1.0` |
| `position` | string | `center` | `center`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `fontSize` | number | `48` | Font size for text watermark |
| `color` | string | `#FF0000` | Hex color for text watermark |

> To use an image watermark, send the watermark image as the `watermark` field alongside `file`.

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="watermarked.pdf"

<binary pdf data>
```

---

#### `POST /pdf/encrypt`

Encrypts a PDF with a password.

**Request**
```http
POST /pdf/encrypt
Content-Type: multipart/form-data

file: <pdf file>
password: "mysecretpassword"
```

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | PDF file to encrypt |
| `password` | string | ✅ | Password to protect the PDF |

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="encrypted.pdf"

<binary pdf data>
```

---

#### `POST /pdf/decrypt`

Removes password protection from a PDF.

**Request**
```http
POST /pdf/decrypt
Content-Type: multipart/form-data

file: <pdf file>
password: "mysecretpassword"
```

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | Encrypted PDF file |
| `password` | string | ✅ | Current password of the PDF |

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="decrypted.pdf"

<binary pdf data>
```

**Response `401`** — wrong password
```json
{
  "error": "Incorrect password",
  "encrypted": true
}
```

---

#### `POST /pdf/metadata`

Reads metadata from a PDF without converting it.

**Request**
```http
POST /pdf/metadata
Content-Type: multipart/form-data

file: <pdf file>
```

**Response `200`**
```json
{
  "title": "Annual Report 2025",
  "author": "John Doe",
  "subject": "Finance",
  "keywords": ["report", "finance", "2025"],
  "creator": "Microsoft Word",
  "producer": "Adobe PDF Library",
  "createdAt": "2025-01-15T09:30:00.000Z",
  "modifiedAt": "2025-03-20T14:00:00.000Z",
  "pageCount": 12,
  "fileSize": 204800,
  "version": "1.7",
  "encrypted": false
}
```

---

## Image Endpoints

### Image Convert

---

#### `POST /image/convert`

Converts an image from one format to another.

**Request**
```http
POST /image/convert?to=webp&quality=80
Content-Type: multipart/form-data

file: <image file>
```

| Query Param | Type | Required | Description |
|---|---|---|---|
| `to` | string | ✅ | Target format: `png`, `jpeg`, `webp`, `gif`, `bmp`, `tiff` |
| `quality` | number | `80` | Output quality `1-100` (lossy formats only) |

**Response `200`**
```http
Content-Type: image/webp
Content-Disposition: attachment; filename="output.webp"

<binary image data>
```

---

#### `POST /image/to/base64`

Converts an image file to a Base64-encoded string.

**Request**
```http
POST /image/to/base64
Content-Type: multipart/form-data

file: <image file>
```

**Response `200`**
```json
{
  "base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "mimeType": "image/png",
  "format": "png",
  "size": 204800
}
```

---

#### `POST /image/from/base64`

Converts a Base64 string back to an image file.

**Request**
```http
POST /image/from/base64
Content-Type: application/json

{
  "base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "format": "png"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `base64` | string | ✅ | Base64-encoded image data |
| `format` | string | ✅ | Output format: `png`, `jpeg`, `webp` |

**Response `200`**
```http
Content-Type: image/png
Content-Disposition: attachment; filename="output.png"

<binary image data>
```

---

### Image Manipulate

---

#### `POST /image/resize`

Resizes an image to specified dimensions.

**Request**
```http
POST /image/resize?width=800&height=600&fit=cover
Content-Type: multipart/form-data

file: <image file>
```

| Query Param | Type | Required | Description |
|---|---|---|---|
| `width` | number | ✅ | Target width in pixels |
| `height` | number | ✅ | Target height in pixels |
| `fit` | string | `cover` | Resize strategy: `cover`, `contain`, `fill`, `inside`, `outside` |

**Response `200`**
```http
Content-Type: image/png
Content-Disposition: attachment; filename="resized.png"

<binary image data>
```

---

#### `POST /image/compress`

Compresses an image to reduce file size.

**Request**
```http
POST /image/compress?quality=70
Content-Type: multipart/form-data

file: <image file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `quality` | number | `70` | Output quality `1-100` |

**Response `200`**
```http
Content-Type: image/jpeg
Content-Disposition: attachment; filename="compressed.jpg"

<binary image data>
```

**Response `200` headers include:**
```http
X-Original-Size: 2048000
X-Compressed-Size: 512000
X-Compression-Ratio: 75%
```

---

#### `POST /image/crop`

Crops an image to a specified region.

**Request**
```http
POST /image/crop?left=100&top=50&width=400&height=300
Content-Type: multipart/form-data

file: <image file>
```

| Query Param | Type | Required | Description |
|---|---|---|---|
| `left` | number | ✅ | X offset from the left edge in pixels |
| `top` | number | ✅ | Y offset from the top edge in pixels |
| `width` | number | ✅ | Width of the crop region in pixels |
| `height` | number | ✅ | Height of the crop region in pixels |

**Response `200`**
```http
Content-Type: image/png
Content-Disposition: attachment; filename="cropped.png"

<binary image data>
```

**Response `400`** — crop out of bounds
```json
{
  "error": "Crop region exceeds image dimensions",
  "imageWidth": 1920,
  "imageHeight": 1080,
  "requestedRegion": { "left": 100, "top": 50, "width": 2000, "height": 300 }
}
```

---

#### `POST /image/rotate`

Rotates an image by a specified degree.

**Request**
```http
POST /image/rotate?degrees=90
Content-Type: multipart/form-data

file: <image file>
```

| Query Param | Type | Required | Description |
|---|---|---|---|
| `degrees` | number | ✅ | Rotation degrees: `90`, `180`, `270` or any value for free rotation |
| `background` | string | `#ffffff` | Background fill color for free rotation |

**Response `200`**
```http
Content-Type: image/png
Content-Disposition: attachment; filename="rotated.png"

<binary image data>
```

---

#### `POST /image/grayscale`

Converts an image to grayscale.

**Request**
```http
POST /image/grayscale
Content-Type: multipart/form-data

file: <image file>
```

**Response `200`**
```http
Content-Type: image/png
Content-Disposition: attachment; filename="grayscale.png"

<binary image data>
```

---

#### `POST /image/flip`

Flips an image horizontally or vertically.

**Request**
```http
POST /image/flip?axis=h
Content-Type: multipart/form-data

file: <image file>
```

| Query Param | Type | Required | Description |
|---|---|---|---|
| `axis` | string | ✅ | `h` for horizontal, `v` for vertical |

**Response `200`**
```http
Content-Type: image/png
Content-Disposition: attachment; filename="flipped.png"

<binary image data>
```

---

#### `POST /image/watermark`

Adds a text watermark to an image.

**Request**
```http
POST /image/watermark?text=CONFIDENTIAL&opacity=0.5&position=center
Content-Type: multipart/form-data

file: <image file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `text` | string | — | Watermark text |
| `opacity` | number | `0.5` | Opacity between `0.0` and `1.0` |
| `position` | string | `center` | `center`, `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `fontSize` | number | `36` | Font size in pixels |
| `color` | string | `#ffffff` | Hex color of the watermark text |

**Response `200`**
```http
Content-Type: image/png
Content-Disposition: attachment; filename="watermarked.png"

<binary image data>
```

---

#### `POST /image/metadata`

Returns metadata and EXIF data from an image.

**Request**
```http
POST /image/metadata
Content-Type: multipart/form-data

file: <image file>
```

**Response `200`**
```json
{
  "format": "jpeg",
  "width": 4032,
  "height": 3024,
  "channels": 3,
  "colorSpace": "sRGB",
  "hasAlpha": false,
  "fileSize": 3145728,
  "dpi": 72,
  "exif": {
    "make": "Apple",
    "model": "iPhone 15 Pro",
    "dateTaken": "2026-01-10T08:30:00.000Z",
    "gps": {
      "latitude": -8.6705,
      "longitude": 115.2126
    },
    "exposureTime": "1/120",
    "fNumber": 1.8,
    "iso": 64
  }
}
```

> `exif` will be `null` if the image has no EXIF data.

---

## Document Endpoints

---

#### `POST /doc/docx/to/pdf`

Converts a Word document to PDF.

**Request**
```http
POST /doc/docx/to/pdf
Content-Type: multipart/form-data

file: <docx file>
```

**Response `200`**
```http
Content-Type: application/pdf
Content-Disposition: attachment; filename="output.pdf"

<binary pdf data>
```

---

#### `POST /doc/docx/to/text`

Extracts plain text from a Word document.

**Request**
```http
POST /doc/docx/to/text
Content-Type: multipart/form-data

file: <docx file>
```

**Response `200`**
```json
{
  "text": "Extracted text content from the Word document...",
  "wordCount": 1240,
  "characterCount": 7850
}
```

---

#### `POST /doc/docx/to/html`

Converts a Word document to HTML.

**Request**
```http
POST /doc/docx/to/html
Content-Type: multipart/form-data

file: <docx file>
```

**Response `200`**
```http
Content-Type: text/html
Content-Disposition: attachment; filename="output.html"

<html content>
```

---

#### `POST /doc/xlsx/to/csv`

Converts an Excel spreadsheet to CSV.

**Request**
```http
POST /doc/xlsx/to/csv?sheet=0
Content-Type: multipart/form-data

file: <xlsx file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `sheet` | number | `0` | Sheet index to convert (0-based) |
| `delimiter` | string | `,` | CSV delimiter character |

**Response `200`**
```http
Content-Type: text/csv
Content-Disposition: attachment; filename="output.csv"

<csv content>
```

---

#### `POST /doc/xlsx/to/json`

Converts an Excel spreadsheet to JSON.

**Request**
```http
POST /doc/xlsx/to/json?sheet=0
Content-Type: multipart/form-data

file: <xlsx file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `sheet` | number | `0` | Sheet index to convert (0-based) |
| `header` | boolean | `true` | Use first row as JSON keys |

**Response `200`**
```json
{
  "sheet": "Sheet1",
  "rowCount": 100,
  "data": [
    { "name": "Alice", "age": 30, "city": "Bali" },
    { "name": "Bob", "age": 25, "city": "Jakarta" }
  ]
}
```

---

#### `POST /doc/csv/to/xlsx`

Converts a CSV file to an Excel spreadsheet.

**Request**
```http
POST /doc/csv/to/xlsx?delimiter=,
Content-Type: multipart/form-data

file: <csv file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `delimiter` | string | `,` | CSV delimiter character |
| `sheetName` | string | `Sheet1` | Name of the output sheet |

**Response `200`**
```http
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="output.xlsx"

<binary xlsx data>
```

---

#### `POST /doc/csv/to/json`

Converts a CSV file to JSON.

**Request**
```http
POST /doc/csv/to/json?delimiter=,
Content-Type: multipart/form-data

file: <csv file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `delimiter` | string | `,` | CSV delimiter character |
| `header` | boolean | `true` | Use first row as JSON keys |

**Response `200`**
```json
{
  "rowCount": 50,
  "data": [
    { "name": "Alice", "age": "30", "city": "Bali" },
    { "name": "Bob", "age": "25", "city": "Jakarta" }
  ]
}
```

---

#### `POST /doc/json/to/csv`

Converts a JSON file to CSV.

**Request**
```http
POST /doc/json/to/csv
Content-Type: multipart/form-data

file: <json file>
```

| Query Param | Type | Default | Description |
|---|---|---|---|
| `delimiter` | string | `,` | CSV delimiter character |

**Response `200`**
```http
Content-Type: text/csv
Content-Disposition: attachment; filename="output.csv"

<csv content>
```

**Response `400`** — invalid JSON structure
```json
{
  "error": "JSON must be an array of objects to convert to CSV",
  "received": "object"
}
```

---

## Endpoint Summary

### Utility

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/formats` | List all supported formats |
| POST | `/detect` | Detect file type |
| POST | `/validate/pdf` | Validate a PDF file |
| POST | `/validate/image` | Validate an image file |

### PDF

| Method | Endpoint | Description |
|---|---|---|
| POST | `/pdf/to/image` | PDF → Image |
| POST | `/pdf/to/text` | PDF → Plain text |
| POST | `/pdf/to/docx` | PDF → Word document |
| POST | `/pdf/to/html` | PDF → HTML |
| POST | `/pdf/from/image` | Image → PDF |
| POST | `/pdf/from/docx` | Word document → PDF |
| POST | `/pdf/from/html` | HTML → PDF |
| POST | `/pdf/from/text` | Plain text → PDF |
| POST | `/pdf/merge` | Merge multiple PDFs |
| POST | `/pdf/split` | Split PDF by pages |
| POST | `/pdf/compress` | Compress a PDF |
| POST | `/pdf/rotate` | Rotate PDF pages |
| POST | `/pdf/extract-pages` | Extract specific pages |
| POST | `/pdf/watermark` | Add watermark to PDF |
| POST | `/pdf/encrypt` | Encrypt PDF with password |
| POST | `/pdf/decrypt` | Remove PDF password |
| POST | `/pdf/metadata` | Read PDF metadata |

### Image

| Method | Endpoint | Description |
|---|---|---|
| POST | `/image/convert` | Convert image format |
| POST | `/image/to/base64` | Image → Base64 |
| POST | `/image/from/base64` | Base64 → Image |
| POST | `/image/resize` | Resize image |
| POST | `/image/compress` | Compress image |
| POST | `/image/crop` | Crop image |
| POST | `/image/rotate` | Rotate image |
| POST | `/image/grayscale` | Convert to grayscale |
| POST | `/image/flip` | Flip image |
| POST | `/image/watermark` | Add watermark to image |
| POST | `/image/metadata` | Read image metadata & EXIF |

### Document

| Method | Endpoint | Description |
|---|---|---|
| POST | `/doc/docx/to/pdf` | DOCX → PDF |
| POST | `/doc/docx/to/text` | DOCX → Plain text |
| POST | `/doc/docx/to/html` | DOCX → HTML |
| POST | `/doc/xlsx/to/csv` | XLSX → CSV |
| POST | `/doc/xlsx/to/json` | XLSX → JSON |
| POST | `/doc/csv/to/xlsx` | CSV → XLSX |
| POST | `/doc/csv/to/json` | CSV → JSON |
| POST | `/doc/json/to/csv` | JSON → CSV |
