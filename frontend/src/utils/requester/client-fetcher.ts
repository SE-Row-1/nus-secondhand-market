import type { Fetcher } from "./fetcher";

export class ClientFetcher implements Fetcher {
  public async fetch<T>(endpoint: string, init: RequestInit = {}) {
    const url = new URL(endpoint, process.env["NEXT_PUBLIC_API_BASE_URL"]);

    const response = await fetch(url, init);

    if (response.status === 204) {
      return undefined as never;
    }

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    return json as T;
  }
}
