import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JUVENTUD VIVA - Plataforma Institucional",
  description: "Fundación JUVENTUD VIVA - Plataforma para la gestión de programas, noticias y documentos públicos.",
  icons: {
    icon: "/logo/juventud-viva.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-jv-dark text-jv-white">
        {children}
      </body>
    </html>
  );
}
