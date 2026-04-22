import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

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
        <link rel="dns-prefetch" href="https://consent.cookiebot.com" />
        <link rel="dns-prefetch" href="https://consentcdn.cookiebot.com" />
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

        {/*
         * Cookiebot CMP — injected dynamically after first user interaction (or
         * a 12s fallback) so it never competes with real content for LCP.
         * `data-blockingmode="manual"` is used instead of `"auto"` because
         * "auto" walks the entire DOM on load and re-processes every script tag,
         * which on a 4x-throttled Moto G Power adds ~8-10s of Total Blocking
         * Time. With "manual", tracking scripts opt in via `data-cookieconsent`
         * attributes instead.
         */}
        <Script
          id="cookiebot-loader"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function deferCookiebot() {
                if (document.getElementById('Cookiebot')) return;
                var fired = false;
                var events = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'];

                function inject() {
                  if (fired) return;
                  fired = true;
                  events.forEach(function (e) {
                    window.removeEventListener(e, inject, { capture: true });
                  });
                  if (document.getElementById('Cookiebot')) return;

                  var s = document.createElement('script');
                  s.id = 'Cookiebot';
                  s.src = 'https://consent.cookiebot.com/uc.js';
                  s.type = 'text/javascript';
                  s.async = true;
                  s.setAttribute('data-cbid', '4b11e694-66f4-4a7d-bb1f-a772d4748d97');
                  s.setAttribute('data-blockingmode', 'manual');
                  document.head.appendChild(s);
                }

                events.forEach(function (e) {
                  window.addEventListener(e, inject, { once: true, passive: true, capture: true });
                });

                // Fallback — 12s is far past typical LCP/CLS finalization.
                setTimeout(inject, 12000);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
