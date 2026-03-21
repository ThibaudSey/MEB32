import type { Metadata } from "next";
import { Inter, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MEB32 – Équipement Avicole depuis 1994 | Gers, Sud-Ouest",
  description:
    "MEB32, spécialiste en équipement avicole depuis 1994. Ventilation, équipement bâtiment poules pondeuses, installation complète et SAV réactif dans le Gers, Hautes-Pyrénées, Landes, Pyrénées-Atlantiques, Lot-et-Garonne, Tarn et Haute-Garonne.",
  keywords: [
    "équipement avicole Gers",
    "ventilation poulailler Sud-Ouest",
    "poules pondeuses équipement",
    "MEB32",
    "installation avicole 32",
    "SAV avicole",
    "Big Dutchman Gers",
    "Roxell installateur Sud-Ouest",
  ],
  openGraph: {
    title: "MEB32 – Équipement Avicole depuis 1994",
    description:
      "Spécialiste en ventilation et équipement pour bâtiments avicoles dans le Sud-Ouest. 30 ans d'expertise, SAV réactif, 7 départements couverts.",
    type: "website",
    locale: "fr_FR",
    siteName: "MEB32",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.meb32.fr/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${sourceSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
