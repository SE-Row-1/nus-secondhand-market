import type { Endpoint, Fetcher } from "./types";

export class Requester {
  constructor(private fetcher: Fetcher) {}

  public async get<T>(endpoint: Endpoint, init: RequestInit = {}) {
    return await this.fetcher.fetch<T>(endpoint, {
      method: "GET",
      ...init,
    });
  }

  public async post<T>(
    endpoint: Endpoint,
    body: Record<string, unknown> = {},
    init: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  }

  public async put<T>(
    endpoint: Endpoint,
    body: Record<string, unknown> = {},
    init: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  }

  public async patch<T>(
    endpoint: Endpoint,
    body: Record<string, unknown> = {},
    init: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  }

  public async delete<T>(endpoint: Endpoint, init: RequestInit = {}) {
    return await this.fetcher.fetch<T>(endpoint, {
      method: "DELETE",
      ...init,
    });
  }

  public async form<T>(
    endpoint: Endpoint,
    body: FormData,
    init: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      method: "POST",
      body,
      ...init,
    });
  }
}
