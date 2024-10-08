import type { Endpoint, Fetcher } from "./fetcher";

export class ClientFetcher implements Fetcher {
  public async fetch<T>(endpoint: Endpoint, init: RequestInit = {}) {
    const url = process.env.NEXT_PUBLIC_API_BASE_URL + endpoint;

    const res = await fetch(url, {
      ...init,
      // TODO: Remove this option once we have a local load balancer.
      credentials:
        process.env.NODE_ENV === "production" ? "same-origin" : "include",
    });

    if (res.status === 204) {
      return undefined as never;
    }

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error);
    }

    return json as T;
  }
}
