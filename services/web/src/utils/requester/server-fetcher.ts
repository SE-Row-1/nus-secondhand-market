import { cookies } from "next/headers";
import type { Endpoint, Fetcher } from "./fetcher";

export class ServerFetcher implements Fetcher {
  public async fetch<T>(endpoint: Endpoint, init: RequestInit = {}) {
    const url = process.env.API_BASE_URL + endpoint;

    const res = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        Cookie: cookies().toString(),
      },
    });

    if (res.status === 204) {
      return undefined as never;
    }

    const json = await res.json();

    if (!res.ok) {
      return undefined as never;
    }

    return json as T;
  }
}
