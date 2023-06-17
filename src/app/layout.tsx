// React Imports
import "./globals.css";

// Next.js Imports
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Maize",
  description: "TBD",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="retro">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}

export default RootLayout;
