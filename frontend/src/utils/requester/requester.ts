import type { Fetcher } from "./fetcher";

export abstract class Requester {
  private fetcher: Fetcher;

  public constructor() {
    this.fetcher = this.createFetcher();
  }

  protected abstract createFetcher(): Fetcher;

  public async get<T>(endpoint: string, config: RequestInit = {}) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  public async post<T>(
    endpoint: string,
    body: unknown = {},
    config: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...config.headers,
        "Content-Type": "application/json",
      },
    });
  }

  public async put<T>(
    endpoint: string,
    body: unknown = {},
    config: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        ...config.headers,
        "Content-Type": "application/json",
      },
    });
  }

  public async patch<T>(
    endpoint: string,
    body: unknown = {},
    config: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        ...config.headers,
        "Content-Type": "application/json",
      },
    });
  }

  public async delete<T>(endpoint: string, config: RequestInit = {}) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }
}
