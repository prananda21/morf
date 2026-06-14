import { serve } from "@hono/node-server";
import { DETECT_HANDLER } from "./module/detect/detect.handler.js";
import { DOC_HANDLER } from "./module/doc/doc.handler.js";
import { FORMAT_HANDLER } from "./module/format/format.handler.js";
import { HEALTH_HANDLER } from "./module/health/health.handler.js";
import { IMAGE_HANDLER } from "./module/image/image.handler.js";
import { PDF_HANDLER } from "./module/pdf/pdf.handler.js";
import { VALIDATE_HANDLER } from "./module/validate/validate.handler.js";
import { OpenAPIHono, $, type OpenAPIObjectConfigure } from "@hono/zod-openapi";
import { showRoutes } from "hono/dev";
import { CONFIG } from "./config.js";
import { Scalar } from "@scalar/hono-api-reference";
import type { MORF } from "../env.js";

const app = $(
  new OpenAPIHono()
    .get("/", (c) => {
      return c.text("Hello this is morf.");
    })
    .route("/", DETECT_HANDLER)
    .route("/", DOC_HANDLER)
    .route("/", FORMAT_HANDLER)
    .route("/", HEALTH_HANDLER)
    .route("/", IMAGE_HANDLER)
    .route("/", PDF_HANDLER)
    .route("/", VALIDATE_HANDLER)
    .get(
      "/docs",
      Scalar({
        url: "/openapi",
        theme: "elysiajs",
        _integration: "hono",
        darkMode: true,
        title: "Morf API",
      }),
    ),
);

// OpenAPI Docs
const openApiDocument: OpenAPIObjectConfigure<MORF, "/docs"> = {
  openapi: "3.1.0",
  info: {
    title: "Morf API",
    description: "Documentation of API Interaction for Morf",
    version: "1.0.0",
  },
};

app.doc31("/openapi", openApiDocument);

const main = async () => {
  console.log("Starting server...");
  console.log(CONFIG.ENVIRONMENT);

  if (CONFIG.ENVIRONMENT == "development") {
    showRoutes(app, { verbose: true });
  }

  serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
};

main();
