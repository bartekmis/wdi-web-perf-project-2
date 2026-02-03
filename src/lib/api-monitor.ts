let apiCallCount = 0;

const subscribers = new Set<(count: number) => void>();

export const getApiCallCount = () => apiCallCount;

export const subscribeToApiCalls = (callback: (count: number) => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback(apiCallCount));
};

// Intercept global fetch instead of axios — all client fetches now use
// native fetch. Guard ensures this only patches in the browser.
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async (...args: Parameters<typeof fetch>) => {
    apiCallCount++;
    const input = args[0];
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    console.log(`[FETCH] API Call #${apiCallCount}: ${url}`);
    notifySubscribers();
    return originalFetch.apply(window, args);
  };
}
