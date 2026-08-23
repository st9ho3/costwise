import { createApiClient } from "@costwise/api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiBrowser = createApiClient({ baseUrl, credentials: "include" });
