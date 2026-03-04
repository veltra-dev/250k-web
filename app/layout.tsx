import type { Metadata } from "next";
import { Layout } from "@/components/layout/layout";
import { GTM } from "@/components/analytics/gtm";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://250k.com.br";

export const metadata: Metadata = {
  title: {
    default: "250k | Consultoria Agrícola",
    template: "%s | 250k",
  },
  description:
    "Consultoria agrícola para alto desempenho. Estratégia, gestão e resultados no campo.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    locale: "pt_BR",
    type: "website",
    siteName: "250k",
    title: "250k | Consultoria Agrícola",
    description:
      "Consultoria agrícola para alto desempenho. Estratégia, gestão e resultados no campo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "250k | Consultoria Agrícola",
    description:
      "Consultoria agrícola para alto desempenho. Estratégia, gestão e resultados no campo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased flex min-h-screen flex-col">
        <GTM />
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
