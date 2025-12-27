import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito, Oswald } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Reno Local Dollars | See How Much Stays in Washoe County",
  description: "Calculate how much of your spending stays in the Washoe County economy when you shop local. Compare local vs. national chains based on Civic Economics studies and IMPLAN data.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://renolocal.xyz"),
  icons: {
    icon: "/rld_logo.png",
    shortcut: "/rld_logo.png",
    apple: "/rld_logo.png",
  },
  openGraph: {
    title: "Reno Local Dollars Calculator",
    description: "See how much stays in Washoe County when you shop local",
    images: [
      {
        url: "/Reno-DT-1400.webp",
        width: 1400,
        height: 933,
        alt: "Downtown Reno skyline with mountains",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reno Local Dollars Calculator",
    description: "See how much stays in Washoe County when you shop local",
    images: ["/Reno-DT-1400.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${oswald.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
