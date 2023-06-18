// React Imports
import { FC, PropsWithChildren } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

// Next.js Imports
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Maize",
  description: "TBD",
};

interface RootLayoutProps extends PropsWithChildren {}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en" data-theme="retro">
      <body className={inter.className}>
        <Navbar />
        <main className="m-8">{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;
