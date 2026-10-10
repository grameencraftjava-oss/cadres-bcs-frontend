import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Cadre's BCS Compass",
  description: 'আপনার বিসিএস প্রস্তুতির সেরা গাইডলাইন',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body className="bg-gray-50">{children}</body>
      </html>
  );
}