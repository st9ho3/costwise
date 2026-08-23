import { headers } from "next/headers";

export type SessionUser = { id: string; name: string | null; email: string | null; image: string | null };
export type Session = { user: SessionUser };

export const getServerSession = async (): Promise<{ user: SessionUser } | null> => {
  const h = await headers();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/v1/auth/get-session`,
    { headers: { cookie: h.get("cookie") ?? "" }, cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user ? { user: data.user } : null;
};
