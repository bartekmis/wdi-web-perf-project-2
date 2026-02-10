import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

// Optimized: use next/font/google for Roboto instead of inline @font-face
// This enables automatic preloading, self-hosting via Next.js, and zero layout shift
const roboto = Roboto({
  weight: "700",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
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
    <html lang="en" className={roboto.variable}>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className={inter.className}>
        {/* Optimized: GTM loaded after hydration instead of sync in <head> */}
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
        {/* Optimized: reCAPTCHA deferred to lazyOnload - not needed for initial render */}
        <Script
          id="recaptcha-script"
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
        {/* Optimized: Cookiebot changed from beforeInteractive to afterInteractive */}
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="b927f844-8454-4007-b4d6-1f297a729316"
          data-blockingmode="auto"
          strategy="afterInteractive"
        />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <QueryProvider>{children}</QueryProvider>
          <footer className="bg-gray-800 text-white py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-lg font-semibold mb-4">
                Performance Demonstration...
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
