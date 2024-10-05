export type Endpoint = `/${string}`;

export interface Fetcher {
  fetch: <T>(endpoint: Endpoint, init?: RequestInit) => Promise<T>;
}
