import z from "zod";

const docxFile = z.instanceof(File).openapi({ type: "string", format: "binary", description: "The DOCX file" });
const xlsxFile = z.instanceof(File).openapi({ type: "string", format: "binary", description: "The XLSX file" });
const csvFile = z.instanceof(File).openapi({ type: "string", format: "binary", description: "The CSV file" });
const jsonFile = z.instanceof(File).openapi({ type: "string", format: "binary", description: "The JSON file" });

const delimiter = z.string().default(",").openapi({ description: "CSV delimiter character", examples: [",", ";"] });
const sheet = z.coerce.number().int().min(0).default(0).openapi({ description: "Sheet index to use (0-based)", examples: [0] });
const header = z.coerce.boolean().default(true).openapi({ description: "Use first row as keys", examples: [true] });

export const DOC_REQUESTS = {
  DOCX_TO_PDF: z.object({ file: docxFile }),
  DOCX_TO_TEXT: z.object({ file: docxFile }),
  DOCX_TO_HTML: z.object({ file: docxFile }),

  XLSX_TO_CSV: z.object({
    file: xlsxFile,
    sheet,
    delimiter,
  }),

  XLSX_TO_JSON: z.object({
    file: xlsxFile,
    sheet,
    header,
  }),

  CSV_TO_XLSX: z.object({
    file: csvFile,
    delimiter,
    sheetName: z.string().default("Sheet1").openapi({ description: "Name of the output sheet", examples: ["Sheet1"] }),
  }),

  CSV_TO_JSON: z.object({
    file: csvFile,
    delimiter,
    header,
  }),

  JSON_TO_CSV: z.object({
    file: jsonFile,
    delimiter,
  }),
};
