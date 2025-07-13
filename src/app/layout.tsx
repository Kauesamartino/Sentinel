import type { Metadata } from "next";
import "./globals.scss";
import Header from "@/_components/Header";


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
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
