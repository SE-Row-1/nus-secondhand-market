import { cookies } from "next/headers";
import type { Endpoint, Fetcher } from "./fetcher";

export class ServerFetcher implements Fetcher {
  public async fetch<T>(endpoint: Endpoint, init: RequestInit = {}) {
    const url = process.env.API_BASE_URL + endpoint;

    const response = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        credentials: "include",
        Cookie: cookies().toString(),
      },
    } as RequestInit);

    if (response.status === 204) {
      return undefined as never;
    }

    const json = await response.json();

    if (!response.ok) {
      return undefined as never;
    }

    return json as T;
  }
}
