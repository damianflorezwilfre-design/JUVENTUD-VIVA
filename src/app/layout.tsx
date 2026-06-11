import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JUVENTUD VIVA | Villanueva - La Guajira",
    template: "%s | JUVENTUD VIVA"
  },
  description: "Fundación JUVENTUD VIVA - Empoderando a la Nueva Generación en Villanueva, La Guajira. Liderazgo comunitario, acción social y educación continua.",
  keywords: ["Juventud Viva", "Villanueva", "La Guajira", "Jóvenes", "Liderazgo", "Fundación", "Acción Social", "Colombia"],
  authors: [{ name: "Juventud ViVa" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/logo/juventud-viva.png"
  },
  verification: {
    google: "5lgCBpFV4O0YjxU7fy3wGrCr5gm1rXgYkbv-GjioNxQ",
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
