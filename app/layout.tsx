import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AURELLE — Dressed in Poetry",
  description:
    "Designer dresses, gowns, lehengas and sarees. Hand-finished occasion wear from the AURELLE atelier.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <LenisProvider>
          <CartProvider>{children}</CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
