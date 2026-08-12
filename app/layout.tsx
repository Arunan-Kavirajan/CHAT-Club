import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-context";
import { ThemeScript } from "@/components/theme/theme-script";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlobalBackground } from "@/components/background/global-background";
import { MobileGate } from "@/components/mobile-gate/mobile-gate";
import { SiteChrome } from "@/components/layout/site-chrome";
import { AppBoot } from "@/components/loading/app-boot";
import { BootScript } from "@/components/loading/boot-script";

export const metadata: Metadata = {
  title: "CHAT — Community of Hackers and Advanced Technologists",
  description:
    "CHAT is SRMIST's cybersecurity club — students who hack, defend, and build, with room to explore fullstack, AI, and other advanced tech along the way.",
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
        <MobileGate />
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
