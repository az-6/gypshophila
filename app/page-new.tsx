import { Metadata } from "next";
import HomepageClient from "@/components/homepage-client";

export const metadata: Metadata = {
  title: "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner Aesthetic",
  description:
    "Sewa Standing Acrylic Flower & Banner yang Aesthetic, Praktis, dan Terjangkau untuk Semua Momen Berharga Anda. Layanan rental terpercaya di Semarang.",
  keywords:
    "sewa standing flower, sewa banner, acrylic flower, standing banner, dekorasi acara, rental semarang, gypshophila boardy",
  openGraph: {
    title: "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner",
    description:
      "Sewa Standing Acrylic Flower & Banner yang Aesthetic, Praktis, dan Terjangkau untuk Semua Momen Berharga Anda.",
    url: "https://your-domain.com",
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
