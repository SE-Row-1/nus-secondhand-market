import { cookies } from "next/headers";
import type { Fetcher } from "./fetcher";

export class ServerFetcher implements Fetcher {
  public async fetch<T>(endpoint: string, init: RequestInit = {}) {
    const url = process.env["API_BASE_URL"] + endpoint;

    const response = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        Cookie: cookies().toString(),
      },
    });

    if (response.status === 204) {
      return null as never;
    }

    const json = await response.json();

    if (!response.ok) {
      return null as never;
    }

    return json as T;
  }
}
