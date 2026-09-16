import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import { getPortfolioData } from "@/lib/db/queries";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { settings, profile: profileData } = await getPortfolioData();
    return {
      title: settings?.metaTitle ?? "Portfolio",
      description: settings?.metaDescription ?? profileData?.bioShort ?? "",
      openGraph: {
        title: settings?.metaTitle ?? "Portfolio",
        description: settings?.metaDescription ?? "",
        images: settings?.ogImageUrl ? [settings.ogImageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Portfolio",
      description: "Professional developer portfolio",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
