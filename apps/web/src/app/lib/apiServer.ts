import { headers } from "next/headers";
import { createApiClient } from "@costwise/api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiServer = async () => {
  const h = await headers();
  return createApiClient({ baseUrl, headers: { cookie: h.get("cookie") ?? "" } });
};
