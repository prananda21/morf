import { createRoute } from "@hono/zod-openapi";
import { PDF_TO_REQUESTS } from "./utils/requests.js";
import { PDF_TO_RESPONSES } from "./utils/responses.js";
import z from "zod";

export const PDF_TO_ROUTES = {
  PDF_TO_IMAGE: createRoute({
    method: "post",
    path: "/pdf/to/image",
    tags: ["PDF To"],
    summary: "Converts a PDF page to an image.",
    description: "Renders a single page of a PDF file into a raster image. Use the query params to control which page, output format (png, jpeg, webp), and resolution (DPI).",
    request: {
      query: PDF_TO_REQUESTS.PDF_TO_IMAGE.pick({
        dpi: true,
        format: true,
        page: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_TO_REQUESTS.PDF_TO_IMAGE.pick({ file: true }),
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "image/png": {
            schema: PDF_TO_RESPONSES.PDF_TO_IMAGE,
          },
        },
        headers: z.object({
          "Content-Disposition": z
            .string()
            .openapi({ example: 'attachment; filename="output.png"' }),
        }),
        description: "Image converted from PDF page",
      },
    },
  }),

  PDF_TO_TEXT: createRoute({
    method: "post",
    path: "/pdf/to/text",
    tags: ["PDF To"],
    summary: "Extracts all text content from a PDF.",
    description: "Reads and returns all plain text content from every page of a PDF. Returns character count and page count alongside the extracted text. Returns an error if the PDF is password-protected.",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_TO_REQUESTS.PDF_TO_TEXT,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: PDF_TO_RESPONSES.PDF_TO_TEXT,
          },
        },
        description: "Text extracted from PDF",
      },
    },
  }),

  PDF_TO_DOCX: createRoute({
    method: "post",
    path: "/pdf/to/docx",
    tags: ["PDF To"],
    summary: "Converts a PDF to a Word document.",
    description: "Converts a PDF file into an editable DOCX format, preserving text and basic layout where possible.",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_TO_REQUESTS.PDF_TO_DOCX,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            {
              schema: PDF_TO_RESPONSES.PDF_TO_DOCX,
            },
        },
        headers: z.object({
          "Content-Disposition": z
            .string()
            .openapi({ example: 'attachment; filename="output.docx"' }),
        }),
        description: "DOCX file converted from PDF",
      },
    },
  }),

  PDF_TO_HTML: createRoute({
    method: "post",
    path: "/pdf/to/html",
    tags: ["PDF To"],
    summary: "Converts a PDF to an HTML file.",
    description: "Converts a PDF into an HTML file, preserving the document structure and layout as closely as possible.",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_TO_REQUESTS.PDF_TO_DOCX,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "text/html": {
            schema: PDF_TO_RESPONSES.PDF_TO_HTML,
          },
        },
        headers: z.object({
          "Content-Disposition": z
            .string()
            .openapi({ example: 'attachment; filename="output.html"' }),
        }),
        description: "HTML file converted from PDF",
      },
    },
  }),
};
