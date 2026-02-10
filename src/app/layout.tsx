import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/components/providers/query-provider";

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
  const recaptchaScript = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preload" href="/fonts/inter-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="aad5a0df-ab8f-46e2-85aa-8dea47103cdb"
          data-blockingmode="auto"
          strategy="afterInteractive"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url('/fonts/inter-regular.woff2') format('woff2');
            }
            @font-face {
              font-family: 'Inter';
              font-style: normal;
              font-weight: 700;
              font-display: swap;
              src: url('/fonts/inter-bold.woff2') format('woff2');
            }
            h1, h2 {
              font-weight: 700;
            }
          `
        }}></style>
      </head>
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
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
          src={recaptchaScript}
          strategy="lazyOnload"
        />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <QueryProvider>{children}</QueryProvider>
          <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-lg font-semibold mb-4">
                Performance Demonstration
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
      </body>
    </html>
  );
}
