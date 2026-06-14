import { createRoute } from "@hono/zod-openapi";
import z from "zod";
import { DOC_REQUESTS } from "./utils/requests.js";
import { DOC_RESPONSES } from "./utils/responses.js";

const contentDisposition = (filename: string) =>
  z.object({
    "Content-Disposition": z
      .string()
      .openapi({ example: `attachment; filename="${filename}"` }),
  });

export const DOC_ROUTES = {
  DOCX_TO_PDF: createRoute({
    method: "post",
    path: "/doc/docx/to/pdf",
    tags: ["Doc"],
    summary: "Converts a Word document to PDF.",
    description: "Converts a DOCX file into a PDF, preserving text formatting, headings, and basic layout.",
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: DOC_REQUESTS.DOCX_TO_PDF },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "application/pdf": { schema: DOC_RESPONSES.DOCX_TO_PDF } },
        headers: contentDisposition("output.pdf"),
        description: "PDF converted from DOCX",
      },
    },
  }),

  DOCX_TO_TEXT: createRoute({
    method: "post",
    path: "/doc/docx/to/text",
    tags: ["Doc"],
    summary: "Extracts plain text from a Word document.",
    description: "Reads all text content from a DOCX file and returns it as a plain string along with word count and character count.",
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: DOC_REQUESTS.DOCX_TO_TEXT },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: DOC_RESPONSES.DOCX_TO_TEXT } },
        description: "Text extracted from DOCX",
      },
    },
  }),

  DOCX_TO_HTML: createRoute({
    method: "post",
    path: "/doc/docx/to/html",
    tags: ["Doc"],
    summary: "Converts a Word document to HTML.",
    description: "Converts a DOCX file to an HTML document, preserving headings, paragraphs, and basic inline formatting.",
    request: {
      body: {
        content: {
          "multipart/form-data": { schema: DOC_REQUESTS.DOCX_TO_HTML },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "text/html": { schema: DOC_RESPONSES.DOCX_TO_HTML } },
        headers: contentDisposition("output.html"),
        description: "HTML converted from DOCX",
      },
    },
  }),

  XLSX_TO_CSV: createRoute({
    method: "post",
    path: "/doc/xlsx/to/csv",
    tags: ["Doc"],
    summary: "Converts an Excel spreadsheet to CSV.",
    description: "Exports a single sheet from an XLSX file as a CSV. Use the sheet query param (0-based index) to select which sheet to export, and delimiter to set the separator character.",
    request: {
      query: DOC_REQUESTS.XLSX_TO_CSV.pick({ sheet: true, delimiter: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: DOC_REQUESTS.XLSX_TO_CSV.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "text/csv": { schema: DOC_RESPONSES.XLSX_TO_CSV } },
        headers: contentDisposition("output.csv"),
        description: "CSV converted from XLSX",
      },
    },
  }),

  XLSX_TO_JSON: createRoute({
    method: "post",
    path: "/doc/xlsx/to/json",
    tags: ["Doc"],
    summary: "Converts an Excel spreadsheet to JSON.",
    description: "Parses a single sheet from an XLSX file into a JSON array of objects. When header=true, the first row is used as object keys.",
    request: {
      query: DOC_REQUESTS.XLSX_TO_JSON.pick({ sheet: true, header: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: DOC_REQUESTS.XLSX_TO_JSON.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: DOC_RESPONSES.XLSX_TO_JSON } },
        description: "JSON converted from XLSX",
      },
    },
  }),

  CSV_TO_XLSX: createRoute({
    method: "post",
    path: "/doc/csv/to/xlsx",
    tags: ["Doc"],
    summary: "Converts a CSV file to an Excel spreadsheet.",
    description: "Parses a CSV file and writes it as a single-sheet XLSX workbook. Use delimiter to match the source file's separator and sheetName to name the output sheet.",
    request: {
      query: DOC_REQUESTS.CSV_TO_XLSX.pick({
        delimiter: true,
        sheetName: true,
      }),
      body: {
        content: {
          "multipart/form-data": {
            schema: DOC_REQUESTS.CSV_TO_XLSX.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: {
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
            schema: DOC_RESPONSES.CSV_TO_XLSX,
          },
        },
        headers: contentDisposition("output.xlsx"),
        description: "XLSX converted from CSV",
      },
    },
  }),

  CSV_TO_JSON: createRoute({
    method: "post",
    path: "/doc/csv/to/json",
    tags: ["Doc"],
    summary: "Converts a CSV file to JSON.",
    description: "Parses a CSV file into a JSON array of objects. When header=true, the first row is used as object keys. All values are returned as strings.",
    request: {
      query: DOC_REQUESTS.CSV_TO_JSON.pick({ delimiter: true, header: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: DOC_REQUESTS.CSV_TO_JSON.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: DOC_RESPONSES.CSV_TO_JSON } },
        description: "JSON converted from CSV",
      },
    },
  }),

  JSON_TO_CSV: createRoute({
    method: "post",
    path: "/doc/json/to/csv",
    tags: ["Doc"],
    summary: "Converts a JSON file to CSV.",
    description: "Serializes a JSON array of objects into a CSV file. The JSON must be a top-level array of flat objects — returns 400 if the structure is not supported.",
    request: {
      query: DOC_REQUESTS.JSON_TO_CSV.pick({ delimiter: true }),
      body: {
        content: {
          "multipart/form-data": {
            schema: DOC_REQUESTS.JSON_TO_CSV.pick({ file: true }),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "text/csv": { schema: DOC_RESPONSES.JSON_TO_CSV } },
        headers: contentDisposition("output.csv"),
        description: "CSV converted from JSON",
      },
    },
  }),
};
