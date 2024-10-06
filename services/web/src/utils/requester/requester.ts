import type { Endpoint, Fetcher } from "./fetcher";

export abstract class Requester {
  private fetcher: Fetcher;

  public constructor() {
    this.fetcher = this.createFetcher();
  }

  protected abstract createFetcher(): Fetcher;

  public async get<T>(endpoint: Endpoint, init: RequestInit = {}) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...init,
      method: "GET",
    });
  }

  public async post<T>(
    endpoint: Endpoint,
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

  public async postForm<T>(
    endpoint: Endpoint,
    body: FormData,
    init: RequestInit = {},
  ) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...init,
      method: "POST",
      body,
      headers: {
        ...init.headers,
        "Content-Type": "multipart/form-data",
      },
    });
  }

  public async put<T>(
    endpoint: Endpoint,
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
    endpoint: Endpoint,
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

  public async delete<T>(endpoint: Endpoint, init: RequestInit = {}) {
    return await this.fetcher.fetch<T>(endpoint, {
      ...init,
      method: "DELETE",
    });
  }
}
