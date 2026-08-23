import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

import Sidebar from "../components/layout/sideBar";
import { getServerSession } from "@/app/lib/serverSession";
import { redirect } from "next/navigation";
import Header from "../components/layout/header";
import TabBar from "../components/layout/tabBar";
import Notification from "../components/shared/notification";

export const metadata: Metadata = {
  title: "Costwise",
  description: "A warm companion for small food and beverage businesses",
  icons: {
    icon: '/images/logo-mark-transparent.png',
    apple: [
      { url: '/images/logo-mark.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Costwise',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cream-50 text-ink-700 font-body antialiased overflow-hidden">
        <div className="flex h-screen w-full bg-cream-50 overflow-hidden">
          <Sidebar />
          <div className="relative flex flex-col flex-1 w-full overflow-hidden min-w-0">
            <Header session={session} />
            <main className="flex-1 overflow-y-auto flex flex-col pb-24 lg:pb-0">
              {children}
              <Analytics />
            </main>
            <TabBar />
          </div>
          <Notification />
        </div>
      </body>
    </html>
  );
}