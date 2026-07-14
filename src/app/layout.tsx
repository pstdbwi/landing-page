import "../style/globals.css";
import type { Metadata } from "next";
import { Exo } from "next/font/google";
const exo = Exo({
  subsets: ["latin"],
  preload: true,
});

import { siteConfig } from "@/constant/config";
import { Providers } from "@/components/ReactQuery";
import Metrics from "./metrics";
import { env } from "@/lib/env";
import Script from "next/script";
import { FeatureFlagProvider } from "@/store/feature-flag-context";
import { OrnamentSpecialFesyar } from "@/components/ornament-special";
import ChunkErrorHandler from "@/components/chunk-error-handler";

export const metadata: Metadata = {
  // manifest: '/manifest.json',
  title: {
    default: siteConfig.title,
    template: `%s`,
  },
  description: siteConfig.description,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* {process.env.NODE_ENV !== "development" ? 
					<Script id="dynamic-manifest" strategy="lazyOnload">
					{`
						var full = window.location.host;
						var parts = full.split('.');
						var sub = parts[0];
						var link = document.createElement('link');
						link.href = '/manifest/' + sub + '.json';
						link.rel = 'manifest';
						document.getElementsByTagName('head')[0].appendChild(link);
					`}
				</Script>
			: null } */}

      <body className={exo.className}>
        <ChunkErrorHandler />

        <Providers>
          <FeatureFlagProvider>
            <main className="min-h-screen relative z-10">{children}</main>
            <OrnamentSpecialFesyar />
          </FeatureFlagProvider>
        </Providers>
        <Metrics />
      </body>
    </html>
  );
}
//link.href = '/manifest/' + parts + '.json';
