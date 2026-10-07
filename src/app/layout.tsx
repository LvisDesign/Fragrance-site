import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Pinyon_Script } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const script = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Your Perfume Brand (For Sale) | Turnkey E-Commerce Store Built for Nigeria",
  description: "Ready-made luxury perfume e-commerce website available for purchase. Built specifically for Nigerian fragrance businesses with Paystack, Naira (₦) payments, delivery tracking, and bespoke catalog management.",
  keywords: ["Perfume website for sale", "turnkey perfume store Nigeria", "perfume e-commerce template", "luxury fragrance Nigeria", "Paystack perfume store"],
  icons: {
    icon: "/generic-luxury-logo.svg",
    apple: "/generic-luxury-logo.svg",
  },
  openGraph: {
    title: "Your Perfume Brand (For Sale) | Turnkey E-Commerce Store Built for Nigeria",
    description: "Ready-made luxury perfume e-commerce website available for purchase. Built specifically for Nigerian fragrance businesses.",
    type: "website",
    locale: "en_NG",
  },
};

import AiConcierge from "@/components/AiConcierge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F5] text-[#18181B] selection:bg-accent selection:text-black">
        <AppProvider>
          {children}
          <AiConcierge />
        </AppProvider>
      </body>
    </html>
  );
}
