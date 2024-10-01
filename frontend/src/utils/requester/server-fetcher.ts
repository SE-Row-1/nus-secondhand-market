import { cookies } from "next/headers";
import type { Fetcher } from "./fetcher";

export class ServerFetcher implements Fetcher {
  public async fetch<T>(endpoint: string, init: RequestInit = {}) {
    const url = new URL(endpoint, process.env["NEXT_PUBLIC_API_BASE_URL"]);

    const response = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        Cookie: cookies().toString(),
      },
    });

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