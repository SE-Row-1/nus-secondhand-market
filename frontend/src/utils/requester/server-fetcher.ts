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
      return undefined as never;
    }

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error);
    }

    return json as T;
  }
}
