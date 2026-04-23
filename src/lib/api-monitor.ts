let apiCallCount = 0;

const subscribers = new Set<(count: number) => void>();

export const getApiCallCount = () => apiCallCount;

export const incrementApiCallCount = () => {
  apiCallCount++;
  notifySubscribers();
};

export const subscribeToApiCalls = (callback: (count: number) => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback(apiCallCount));
};
