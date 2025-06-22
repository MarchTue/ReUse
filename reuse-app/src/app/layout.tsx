import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Re-Use",
  description: "DID 기반 신원 인증과 블록체인 기술을 활용한 투명하고 안전한 중고 거래 플랫폼",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Re-Use",
  },
  formatDetection: {
    telephone: false,
  },
};


export const viewport: Viewport = {
  themeColor: "#007aff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head></head>
      <body
        className={inter.className}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen bg-background">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
