import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prompt Builder",
  description: "Crie prompts de alta qualidade com IA.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  // viewport-fit=cover is required for the env(safe-area-inset-*) values the
  // top status-bar background relies on. themeColor tints the status bar on
  // Android/Chrome PWAs to match the iOS bar below.
  viewportFit: "cover",
  themeColor: "#60a5fa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/*
        These iOS PWA tags are rendered as literal JSX in <head> instead of via
        the metadata export. Next 15 streams late metadata into <body>, where
        iOS's Add-to-Home-Screen parser can't see them.
      */}
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Prompt Builder" />
        <link rel="apple-touch-icon" href="/favicon-180.png" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/20`}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
