import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.scss";
import Header from "@/_components/Header";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Sentinel",
  description: "Sistema de gerenciamento de riscos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={sora.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
