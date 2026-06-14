import { createRoute } from "@hono/zod-openapi";
import z from "zod";
import { PDF_MANIPULATION_REQUESTS } from "./utils/requests.js";
import { PDF_MANIPULATION_RESPONSES } from "./utils/responses.js";

const pdfBinaryResponse = (filename: string, description: string) => ({
  200: {
    content: {
      "application/pdf": { schema: PDF_MANIPULATION_RESPONSES.MERGE },
    },
    headers: z.object({
      "Content-Disposition": z
        .string()
        .openapi({ example: `attachment; filename="${filename}"` }),
    }),
    description,
  },
});

export const PDF_MANIPULATION_ROUTES = {
  MERGE: createRoute({
    method: "post",
    path: "/pdf/merge",
    tags: ["PDF Manipulation"],
    summary: "Merges multiple PDF files into one.",
    description: "Combines two or more PDF files into a single PDF in the order they are uploaded. Requires at least 2 files.",
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: PDF_MANIPULATION_REQUESTS.MERGE },
        },
        required: true,
      },
    },
    responses: pdfBinaryResponse("merged.pdf", "Merged PDF file"),
  }),

  SPLIT: createRoute({
    method: "post",
    path: "/pdf/split",
    tags: ["PDF Manipulation"],
    summary: "Splits a PDF into multiple PDFs by page ranges.",
    description: "Returns a ZIP archive.",
    request: {
      query: PDF_MANIPULATION_REQUESTS.SPLIT.pick({ pages: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_MANIPULATION_REQUESTS.SPLIT.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "application/zip": { schema: PDF_MANIPULATION_RESPONSES.SPLIT },
        },
        headers: z.object({
          "Content-Disposition": z
            .string()
            .openapi({ example: 'attachment; filename="split.zip"' }),
        }),
        description: "ZIP archive of split PDF files",
      },
    },
  }),

  COMPRESS: createRoute({
    method: "post",
    path: "/pdf/compress",
    tags: ["PDF Manipulation"],
    summary: "Reduces the file size of a PDF.",
    description: "Compresses a PDF to reduce its file size. Response headers include the original size, compressed size, and compression ratio.",
    request: {
      query: PDF_MANIPULATION_REQUESTS.COMPRESS.pick({ quality: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_MANIPULATION_REQUESTS.COMPRESS.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "application/pdf": { schema: PDF_MANIPULATION_RESPONSES.COMPRESS },
        },
        headers: z.object({
          "Content-Disposition": z
            .string()
            .openapi({ example: 'attachment; filename="compressed.pdf"' }),
          "X-Original-Size": z.string().openapi({ example: "5242880" }),
          "X-Compressed-Size": z.string().openapi({ example: "1048576" }),
          "X-Compression-Ratio": z.string().openapi({ example: "80%" }),
        }),
        description: "Compressed PDF file",
      },
    },
  }),

  ROTATE: createRoute({
    method: "post",
    path: "/pdf/rotate",
    tags: ["PDF Manipulation"],
    summary: "Rotates all or specific pages of a PDF.",
    description: "Rotates pages of a PDF by 90, 180, or 270 degrees. Omit the pages query param to rotate all pages.",
    request: {
      query: PDF_MANIPULATION_REQUESTS.ROTATE.pick({
        degrees: true,
        pages: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_MANIPULATION_REQUESTS.ROTATE.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: pdfBinaryResponse("rotated.pdf", "Rotated PDF file"),
  }),

  EXTRACT_PAGES: createRoute({
    method: "post",
    path: "/pdf/extract-pages",
    tags: ["PDF Manipulation"],
    summary: "Extracts specific pages from a PDF into a new PDF.",
    description: "Creates a new PDF containing only the specified pages or page ranges from the source PDF.",
    request: {
      query: PDF_MANIPULATION_REQUESTS.EXTRACT_PAGES.pick({ pages: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_MANIPULATION_REQUESTS.EXTRACT_PAGES.pick({
              file: true,
            }),
          },
        },
        required: true,
      },
    },
    responses: pdfBinaryResponse("extracted.pdf", "PDF with extracted pages"),
  }),

  WATERMARK: createRoute({
    method: "post",
    path: "/pdf/watermark",
    tags: ["PDF Manipulation"],
    summary: "Adds a text or image watermark to all pages of a PDF.",
    description: "Overlays a text or image watermark on every page. Provide either the text query param or an image file in the watermark field — not both.",
    request: {
      query: PDF_MANIPULATION_REQUESTS.WATERMARK.pick({
        text: true,
        opacity: true,
        position: true,
        fontSize: true,
        color: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_MANIPULATION_REQUESTS.WATERMARK.pick({
              file: true,
              watermark: true,
            }),
          },
        },
        required: true,
      },
    },
    responses: pdfBinaryResponse("watermarked.pdf", "Watermarked PDF file"),
  }),

  ENCRYPT: createRoute({
    method: "post",
    path: "/pdf/encrypt",
    tags: ["PDF Manipulation"],
    summary: "Encrypts a PDF with a password.",
    description: "Applies password protection to a PDF. The resulting file requires the provided password to open.",
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: PDF_MANIPULATION_REQUESTS.ENCRYPT },
        },
        required: true,
      },
    },
    responses: pdfBinaryResponse("encrypted.pdf", "Encrypted PDF file"),
  }),

  DECRYPT: createRoute({
    method: "post",
    path: "/pdf/decrypt",
    tags: ["PDF Manipulation"],
    summary: "Removes password protection from a PDF.",
    description: "Decrypts a password-protected PDF using the provided password. Returns 401 if the password is incorrect.",
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: PDF_MANIPULATION_REQUESTS.DECRYPT },
        },
        required: true,
      },
    },
    responses: pdfBinaryResponse("decrypted.pdf", "Decrypted PDF file"),
  }),

  METADATA: createRoute({
    method: "post",
    path: "/pdf/metadata",
    tags: ["PDF Manipulation"],
    summary: "Reads metadata from a PDF.",
    description: "Extracts document metadata from a PDF without converting it — including title, author, page count, version, file size, and encryption status.",
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: PDF_MANIPULATION_REQUESTS.METADATA },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "application/json": { schema: PDF_MANIPULATION_RESPONSES.METADATA },
        },
        description: "PDF metadata",
      },
    },
  }),
};
