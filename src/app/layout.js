import { Geist, Geist_Mono, Hind } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const hind = Hind({
  variable: "--font-hind",
  weight: ["300", "400", "500", "600", "700"], // Hind supports multiple weights
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Evol AI",
  description:
    "An interactive jewelry kiosk where users answer a few questions and AI recommends the perfect jewelry. Spin the wheel to win gold beans and exclusive coupon codes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hind?.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
