import createClient, { type Client } from "openapi-fetch";
import type { paths } from "./schema";

export type ApiClient = Client<paths>;
export type { paths };

export const createApiClient = (opts: {
  baseUrl: string;
  fetch?: typeof fetch;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}): ApiClient =>
  createClient<paths>({
    baseUrl: opts.baseUrl,
    fetch: opts.fetch,
    headers: opts.headers,
    credentials: opts.credentials,
  });
