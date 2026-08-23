import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Costwise — Sign In",
  description: "A companion for small food and beverage businesses",
  icons: {
    icon: '/images/logo-mark-transparent.png',
  },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cream-50 text-ink-700 font-body antialiased min-h-screen">
        <main className="min-h-screen w-full flex">
          {children}
        </main>
      </body>
    </html>
  );
}