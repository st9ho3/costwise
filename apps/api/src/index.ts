import { serve } from "@hono/node-server";
import { createApp } from "./app";

serve({ fetch: createApp({}).fetch, port: 3001 }, (i) =>
  console.log(`api listening on :${i.port}`)
);
