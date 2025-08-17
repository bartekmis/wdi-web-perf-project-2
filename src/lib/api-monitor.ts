import axios from "axios";

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

axios.interceptors.request.use(
  (config) => {
    apiCallCount++;
    console.log(
      `[AXIOS] API Call #${apiCallCount}: ${config.method?.toUpperCase()} ${
        config.url
      }`
    );
    notifySubscribers();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
