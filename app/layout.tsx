import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/providers/session-provider";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "SecureAuth";
const APP_DESCRIPTION = "Sistema de autenticación seguro con verificación de dos factores, cifrado de extremo a extremo y protección avanzada contra accesos no autorizados.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: `${APP_NAME} | Autenticación Segura`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "autenticación segura",
    "two-factor authentication",
    "2FA",
    "seguridad",
    "login seguro",
    "verificación de identidad",
  ],
  authors: [{ name: "SecureAuth Team" }],
  creator: "SecureAuth",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: APP_NAME,
    title: `${APP_NAME} | Autenticación Segura`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} | Autenticación Segura`,
    description: APP_DESCRIPTION,
    images: ["/og-image.png"],
  },

  // Robots - indexación controlada
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Manifest para PWA
  manifest: "/manifest.json",

  // Metadatos adicionales
  applicationName: APP_NAME,
  category: "security",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
        <Toaster richColors position="bottom-right" className="z-9999" closeButton duration={3000} />
      </body>
    </html>
  );
}
