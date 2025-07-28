import { Metadata } from "next";
import HomepageClient from "@/components/homepage-client";

export const metadata: Metadata = {
  title: "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner Semarang",
  description:
    "Sewa Standing Acrylic Flower & Banner Aesthetic di Semarang. Praktis, Terjangkau, dan Berkualitas untuk Wedding, Wisuda, Grand Opening. Free Konsultasi!",
  keywords:
    "sewa standing flower semarang, sewa banner semarang, acrylic flower semarang, standing banner wedding, dekorasi acara semarang, rental flower board semarang, gypshophila boardy, sewa dekorasi murah semarang, papan bunga semarang",
  openGraph: {
    title: "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner",
    description:
      "Sewa Standing Acrylic Flower & Banner yang Aesthetic, Praktis, dan Terjangkau untuk Semua Momen Berharga Anda.",
    url: "https://gypshopila.vercel.app",
    siteName: "Gypshophila Boardy",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner",
    description:
      "Sewa Standing Acrylic Flower & Banner yang Aesthetic, Praktis, dan Terjangkau untuk Semua Momen Berharga Anda.",
  },
  verification: {
    google: "2kZ3sswUXOR06tRimHuJgAjOXCFW3GJ1t_m6TJ2wz7s",
  },
};

export default function GypshophilaBoardy() {
  return <HomepageClient />;
}
