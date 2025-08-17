import Link from "next/link";

export default function Home() {
  return (
    <>
      <link rel="stylesheet" type="text/css" href="https://cdn.wpcc.io/lib/1.0.2/cookieconsent.min.css"/>
      <script src="https://cdn.wpcc.io/lib/1.0.2/cookieconsent.min.js" defer></script>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener("load", function(){
            window.wpcc.init({
              "border":"thin",
              "colors":{
                "popup":{"background":"#ffffff","text":"#000000","border":"#f1273b"},
                "button":{"background":"#0085ff","text":"#ffffff"}
              },
              "content":{
                "href":"/privacy-policy/",
                "button":"Continue"
              }
            })
          });
        `
      }} />
      <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Demo Wydajności Next.js
      </h1>
      <p className="text-xl text-gray-700 mb-10">
        Przejdź do poszczególnych sekcji, aby poznać i naprawić problemy
        wydajnościowe.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Link
          href="/csr"
          className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-8 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-out min-h-[120px] flex items-center justify-center text-center"
        >
          <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
            Client-Side Rendering (CSR)
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>

        <Link
          href="/ssr"
          className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-8 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-out min-h-[120px] flex items-center justify-center text-center"
        >
          <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
            Server-Side Rendering (SSR)
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>

        <Link
          href="/suspense"
          className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-8 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-out min-h-[120px] flex items-center justify-center text-center"
        >
          <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
            Suspense + Streaming
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>

        <Link
          href="/isr"
          className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-8 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-out min-h-[120px] flex items-center justify-center text-center"
        >
          <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
            Incremental Static Regeneration (ISR)
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>

        <Link
          href="/offers"
          className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-8 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-out min-h-[120px] flex items-center justify-center text-center"
        >
          <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
            Strona Ofert Listing
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>
      </div>
    </>
  );
}
