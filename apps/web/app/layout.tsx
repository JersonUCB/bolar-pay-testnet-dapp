import type { Metadata } from "next";
import "../public/fonts/fonts.css";
import "./globals.css";
import { LabProvider } from "@/components/lab/lab-provider";

export const metadata: Metadata = {
  title: "BOLAR | Laboratorio testnet",
  description: "Laboratorio educativo de remesas. Sin dinero real ni documentos personales.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es" className="h-full antialiased"><body className="min-h-full flex flex-col">
    <LabProvider>{children}</LabProvider>
  </body></html>;
}
