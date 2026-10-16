import type { Metadata } from "next";
import { Epilogue, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Les Fabricants de Joie du Niger",
  description: "Propulser la culture et l'innovation sociale au Niger. Redéfinir l'aide par l'autonomie, l'art et la joie — un mouvement intergénérationnel depuis 1976.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${epilogue.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Material Symbols Outlined exactly as in the mockup */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
