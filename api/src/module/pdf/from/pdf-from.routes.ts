import { createRoute } from "@hono/zod-openapi";
import z from "zod";
import { PDF_FROM_REQUESTS } from "./utils/requests.js";
import { PDF_FROM_RESPONSES } from "./utils/responses.js";

const pdfResponse = {
  200: {
    content: {
      "application/pdf": {
        schema: PDF_FROM_RESPONSES.TO_PDF,
      },
    },
    headers: z.object({
      "Content-Disposition": z
        .string()
        .openapi({ example: 'attachment; filename="output.pdf"' }),
    }),
    description: "PDF file output",
  },
};

export const PDF_FROM_ROUTES = {
  IMAGE_TO_PDF: createRoute({
    method: "post",
    path: "/pdf/from/image",
    tags: ["PDF From"],
    summary: "Converts an image to a PDF.",
    description: "Wraps a PNG, JPEG, or WEBP image into a single-page PDF. Use query params to control how the image fits the page and the output page size.",
    request: {
      query: PDF_FROM_REQUESTS.IMAGE_TO_PDF.pick({ fit: true, pageSize: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_FROM_REQUESTS.IMAGE_TO_PDF.pick({ file: true }),
          },
        },
      },
    },
    responses: pdfResponse,
  }),

  DOCX_TO_PDF: createRoute({
    method: "post",
    path: "/pdf/from/docx",
    tags: ["PDF From"],
    summary: "Converts a Word document to a PDF.",
    description: "Converts a DOCX file into a PDF, preserving text formatting, headings, and basic layout.",
    request: {
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_FROM_REQUESTS.DOCX_TO_PDF,
          },
        },
      },
    },
    responses: pdfResponse,
  }),

  HTML_TO_PDF: createRoute({
    method: "post",
    path: "/pdf/from/html",
    tags: ["PDF From"],
    summary: "Converts an HTML file to a PDF.",
    description: "Renders an HTML file into a PDF using a headless browser engine. Supports page size, margin, and orientation configuration via query params.",
    request: {
      query: PDF_FROM_REQUESTS.HTML_TO_PDF.pick({
        pageSize: true,
        margin: true,
        orientation: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_FROM_REQUESTS.HTML_TO_PDF.pick({ file: true }),
          },
        },
      },
    },
    responses: pdfResponse,
  }),

  TEXT_TO_PDF: createRoute({
    method: "post",
    path: "/pdf/from/text",
    tags: ["PDF From"],
    summary: "Converts plain text to a PDF.",
    description: "Renders a plain text (.txt) file into a PDF. Use query params to control font family, font size, and page size.",
    request: {
      query: PDF_FROM_REQUESTS.TEXT_TO_PDF.pick({
        fontSize: true,
        fontFamily: true,
        pageSize: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: PDF_FROM_REQUESTS.TEXT_TO_PDF.pick({ file: true }),
          },
        },
      },
    },
    responses: pdfResponse,
  }),
};
