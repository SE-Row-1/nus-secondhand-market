import type { Fetcher } from "./fetcher";

export abstract class Requester {
  private fetcher: Fetcher;

  public constructor() {
    this.fetcher = this.createFetcher();
  }

  protected abstract createFetcher(): Fetcher;

  public async get<T>(endpoint: string, init: RequestInit = {}) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...init,
      method: "GET",
    });
  }

  public async post<T>(
    endpoint: string,
    body: unknown = {},
    init: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...init.headers,
        "Content-Type": "application/json",
      },
    });
  }

  public async put<T>(
    endpoint: string,
    body: unknown = {},
    init: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        ...init.headers,
        "Content-Type": "application/json",
      },
    });
  }

  public async patch<T>(
    endpoint: string,
    body: unknown = {},
    init: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...init,
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        ...init.headers,
        "Content-Type": "application/json",
      },
    });
  }

  public async delete<T>(endpoint: string, init: RequestInit = {}) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...init,
      method: "DELETE",
    });
  }
}
