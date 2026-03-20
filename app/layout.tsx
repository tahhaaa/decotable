import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { PwaProvider } from "@/components/providers/pwa-provider";
import { StoreProvider } from "@/components/providers/store-provider";
import { TrafficTracker } from "@/components/providers/traffic-tracker";
import { absoluteUrl } from "@/lib/utils";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Decotable | Decoration & art de table au Maroc",
    template: "%s | Decotable",
  },
  description:
    "Decotable propose une selection premium de decoration, vaisselle et idees cadeaux avec livraison rapide au Maroc.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Decotable",
    description: "Decoration, art de table et idees cadeaux haut de gamme au Maroc.",
    url: absoluteUrl("/"),
    siteName: "Decotable",
    locale: "fr_MA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#C4A484",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <StoreProvider>
          <PwaProvider />
          <TrafficTracker />
          <Header />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
