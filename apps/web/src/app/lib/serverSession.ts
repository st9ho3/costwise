import { headers } from "next/headers";

export type SessionUser = { id: string; name: string | null; email: string | null; image: string | null };
export type Session = { user: SessionUser };

export const getServerSession = async (): Promise<{ user: SessionUser } | null> => {
  const h = await headers();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/v1/auth/get-session`,
    { headers: { cookie: h.get("cookie") ?? "" }, cache: "no-store" }
  );
  if (!res.ok) {
    if (process.env.AUTH_DEBUG) {
      console.log(`[session] get-session -> ${res.status} (treated as signed out)`);
    }
    return null;
  }
  const data = await res.json();

  if (process.env.AUTH_DEBUG) {
    const cookie = h.get("cookie") ?? "";
    console.log(
      `[session] get-session -> 200 user=${data?.user?.id ?? "none"}` +
        ` cookie-sent=${/better-auth\.session/.test(cookie) ? "session" : "none"}`
    );
  }

  return data?.user ? { user: data.user } : null;
};
