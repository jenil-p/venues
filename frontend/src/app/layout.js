import "./globals.css";
import { poppins, inter, liber } from '@/styles/fonts'
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Venue finder Platform",
  description: "VenueFinder | reserve, host, earn with us!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${liber.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
