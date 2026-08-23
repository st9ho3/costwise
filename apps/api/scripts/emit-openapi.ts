import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "../src/app";

const stub = new Proxy({}, { get: () => () => { throw new Error("emit-only"); } });
const app = createApp(stub as never);
const doc = typeof (app as any).getOpenAPI31Document === "function"
  ? (app as any).getOpenAPI31Document({
      openapi: "3.1.0",
      info: { title: "CostWise API", version: "1" },
    })
  : (app as any).getOpenAPIDocument({
      openapi: "3.0.0",
      info: { title: "CostWise API", version: "1" },
    });

const targetUrl = new URL("../../../packages/api-client/openapi.json", import.meta.url);
mkdirSync(dirname(fileURLToPath(targetUrl)), { recursive: true });
writeFileSync(targetUrl, JSON.stringify(doc, null, 2));
console.log("openapi.json written");
