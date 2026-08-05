import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://swisssignature.com"),
  title: {
    default: "Swiss Signature Perfumes — Luxury Fragrances",
    template: "%s | Swiss Signature Perfumes",
  },
  description:
    "Discover premium Swiss-crafted fragrances that embody elegance, precision, and timeless sophistication. Curated collection of luxury perfumes for the discerning individual.",
  keywords: [
    "luxury perfume",
    "Swiss fragrance",
    "premium perfume",
    "designer fragrance",
    "Swiss Signature",
    "niche perfume",
    "artisan fragrance",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://swisssignature.com",
    siteName: "Swiss Signature Perfumes",
    title: "Swiss Signature Perfumes — Luxury Fragrances",
    description:
      "Discover premium Swiss-crafted fragrances that embody elegance, precision, and timeless sophistication.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Swiss Signature Perfumes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swiss Signature Perfumes — Luxury Fragrances",
    description:
      "Discover premium Swiss-crafted fragrances that embody elegance, precision, and timeless sophistication.",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1A1A1A",
              color: "#F5F0E8",
              border: "1px solid rgba(201, 168, 76, 0.2)",
              borderRadius: "8px",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: {
                primary: "#C9A84C",
                secondary: "#0A0A0A",
              },
            },
          }}
        />
        <Header />
        <CartSidebar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
