import { Layout } from "@/components/layout";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Deltagum - Des bonbons qui éveillent vos sens",
  description:
    "Découvrez nos créations artisanales aux saveurs uniques de fraise, myrtille et pomme. Des bonbons qui éveillent vos sens !",
  keywords: [
    "bonbons",
    "artisanal",
    "fraise",
    "myrtille",
    "pomme",
    "deltagum",
    "confiserie",
  ],
  authors: [{ name: "Deltagum" }],
  creator: "Deltagum",
  publisher: "Deltagum",
  openGraph: {
    title: "Deltagum - Des bonbons qui éveillent vos sens",
    description:
      "Découvrez nos créations artisanales aux saveurs uniques de fraise, myrtille et pomme.",
    url: "https://deltagum.com",
    siteName: "Deltagum",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Deltagum - Bonbons artisanaux",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deltagum - Des bonbons qui éveillent vos sens",
    description:
      "Découvrez nos créations artisanales aux saveurs uniques de fraise, myrtille et pomme.",
    images: ["/og-image.jpg"],
    creator: "@deltagum",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
