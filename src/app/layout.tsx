import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job hunter Performance Demo",
  description:
    "A performance demonstration with multiple rendering techniques and intentional bottlenecks for optimization training",
  keywords: "jobs, career, performance, next.js, optimization",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://dummyjson.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://dummyjson.com" />
        {gtmId && (
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        )}
        <link rel="dns-prefetch" href="https://www.termsfeed.com" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <QueryProvider>{children}</QueryProvider>
          <footer
            className="bg-gray-800 text-white py-8 mt-auto"
            style={{ contentVisibility: "auto", containIntrinsicSize: "200px" }}
          >
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-lg font-semibold mb-4">
                Performance Demonstration.
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <strong>Client-Side:</strong> Over-fetching, no caching,
                  redundant requests
                </div>
                <div>
                  <strong>Server-Side:</strong> No caching, sequential requests,
                  redundant fetches
                </div>
                <div>
                  <strong>SSG:</strong> Revalidate 0, over-fetching at build
                  time
                </div>
                <div>
                  <strong>Suspense:</strong> Inefficient streaming, redundant
                  requests
                </div>
                <div>
                  <strong>ISR:</strong> Short revalidation, over-processing
                </div>
              </div>
            </div>
          </footer>
        </div>

        {gtmId && (
          <Script
            id="gtm"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}

        <Script
          id="cookie-consent-lib"
          src="https://www.termsfeed.com/public/cookie-consent/4.2.0/cookie-consent.js"
          strategy="lazyOnload"
        />
        <Script
          id="cookie-consent-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function run() {
                if (window.cookieconsent && typeof window.cookieconsent.run === 'function') {
                  window.cookieconsent.run({
                    notice_banner_type: "simple",
                    consent_type: "express",
                    palette: "dark",
                    language: "pl",
                    page_load_consent_levels: ["strictly-necessary"],
                    notice_banner_reject_button_hide: false,
                    preferences_center_close_button_hide: false,
                    page_refresh_confirmation_buttons: false,
                    website_name: "WDI Training"
                  });
                } else {
                  setTimeout(run, 100);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
