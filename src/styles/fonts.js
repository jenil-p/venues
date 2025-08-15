import { Poppins, Inter } from "next/font/google";
import { Libertinus_Mono } from "next/font/google"

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const liber = Libertinus_Mono({
  subsets: ["latin"],
  weight:"400",
  variable: "--font-libermono",
});