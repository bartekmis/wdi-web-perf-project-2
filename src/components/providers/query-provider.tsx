'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Optimized: sensible defaults to reduce redundant client-side requests
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 60s - data considered fresh, no refetch
        refetchOnWindowFocus: false, // don't refetch on tab switch
        refetchOnMount: true,
        retry: 1, // reduced from 3 to minimize failed request retries
        retryDelay: 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}