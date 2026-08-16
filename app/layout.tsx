import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-context";
import { ThemeScript } from "@/components/theme/theme-script";
import { GlobalBackground } from "@/components/background/global-background";
import { SiteChrome } from "@/components/layout/site-chrome";
import { AppBoot } from "@/components/loading/app-boot";
import { BootScript } from "@/components/loading/boot-script";

export const metadata: Metadata = {
  title: "CHAT | Community of Hackers and Advanced Technologists",
  description:
    "CHAT is SRMIST's cybersecurity club - students who hack, defend, and build, with room to explore fullstack, AI, and other advanced tech along the way.",

  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "CHAT Club",
    description: "Breach. Defend. Innovate.",
    url: "https://chat-club-srm.vercel.app",
    siteName: "CHAT Club",
    images: [
      {
        url: "/og-image-purple.jpg",
        width: 1200,
        height: 630,
        alt: "CHAT Club Terminal Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <BootScript />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <GlobalBackground />
          <AppBoot>
            <SiteChrome>{children}</SiteChrome>
          </AppBoot>
        </ThemeProvider>
      </body>
    </html>
  );
}