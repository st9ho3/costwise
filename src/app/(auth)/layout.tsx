/**
 * - Defines a root layout for authentication-related pages (e.g., sign-in, sign-up).
 * - Sets shared metadata including page title and description.
 * - Applies global styles via `../globals.css`.
 * - Wraps child pages in a semantic HTML structure with a main container that prevents vertical overflow.
 */
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Auth Page",
  description: "Auth page for user authentication",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body>
            <main className="flex-1 overflow-y-hidden">
              {children}
            </main>
      </body>
    </html>
  );
}