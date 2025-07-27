import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Gypshophila Boardy - Sewa Standing Acrylic Flower & Banner",
  description:
    "Layanan sewa standing acrylic flower dan standing banner yang aesthetic, praktis, dan terjangkau untuk semua momen berharga Anda.",
  keywords: "sewa standing flower, standing banner, acrylic flower, dekorasi acara, rental banner",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
