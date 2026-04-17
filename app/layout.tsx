import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Joshies List — Know which jobs to walk away from",
  description: "The contractor-to-homeowner rating platform. Check clients before you bid. Stop losing money on bad jobs.",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "Joshies List — Know which jobs to walk away from",
    description: "Rate homeowners, check reviews, and protect your bottom line before you bid. Built by contractors, for contractors.",
    siteName: "Joshies List",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Joshies List — Know which jobs to walk away from",
    description: "Rate homeowners, check reviews, and protect your bottom line before you bid.",
  },
  metadataBase: new URL('https://joshieslist.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
