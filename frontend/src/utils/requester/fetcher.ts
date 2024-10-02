export interface Fetcher {
  fetch: <T>(endpoint: string, init?: RequestInit) => Promise<T>;
}
