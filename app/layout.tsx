import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Practica Español - Spanish Conversation Practice",
  description: "Practice Spanish conversation with an AI tutor that adapts to your level",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
