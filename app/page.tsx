import type { Metadata } from "next";
import { Inter } from "next/font/google";
import HomepageClient from "@/components/homepage-client";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://gypshophila.vercel.app"),
  title: {
    default:
      "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner Semarang",
    template: "%s | Gypshophila Boardy",
  },
  description:
    "Sewa Standing Acrylic Flower & Banner Aesthetic di Semarang. Praktis, Terjangkau, dan Berkualitas untuk Wedding, Wisuda, Grand Opening. Free Konsultasi!",
  keywords:
    "sewa standing flower semarang, sewa banner semarang, acrylic flower semarang, standing banner wedding, dekorasi acara semarang, rental flower board semarang, gypshophila boardy, sewa dekorasi murah semarang, papan bunga semarang",
  authors: [{ name: "Gypshophila Boardy" }],
  creator: "Gypshophila Boardy",
  publisher: "Gypshophila Boardy",
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
  verification: {
    google: "2kZ3sswUXOR06tRimHuJgAjOXCFW3GJ1t_m6TJ2wz7s",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://gypshophila.vercel.app",
    siteName: "Gypshophila Boardy",
    title: "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner",
    description:
      "Sewa Standing Acrylic Flower & Banner yang Aesthetic, Praktis, dan Terjangkau untuk Semua Momen Berharga Anda.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner",
    description:
      "Sewa Standing Acrylic Flower & Banner yang Aesthetic, Praktis, dan Terjangkau untuk Semua Momen Berharga Anda.",
  },
};

export default function GypshophilaBoardy() {
  return <HomepageClient />;
}
