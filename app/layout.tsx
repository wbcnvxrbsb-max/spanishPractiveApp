import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://practice-languages.onrender.com"),
  title: {
    default: "Practica - AI Spanish & Portuguese Conversation Practice",
    template: "%s | Practica",
  },
  description:
    "Practice 38+ languages through natural AI conversation. 10 levels, 6 real-world scenarios, voice recognition, and instant grammar correction.",
  keywords: [
    "language practice",
    "AI language tutor",
    "conversation practice",
    "learn Spanish",
    "learn French",
    "learn Japanese",
    "learn Korean",
  ],
  openGraph: {
    type: "website",
    siteName: "Practica",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-4189915978245468" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4189915978245468"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
