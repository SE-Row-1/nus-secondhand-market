import type { HttpError } from "./http-error";

type Endpoint = `/${string}`;

type ClientResult<Expectation> = Expectation;

type ServerResult<Expectation> =
  | { data: Expectation; error: null }
  | { data: null; error: HttpError };

type ClientFetch = <Expectation>(
  endpoint: Endpoint,
  init?: RequestInit,
) => Promise<ClientResult<Expectation>>;

type ServerFetch = <Expectation>(
  endpoint: Endpoint,
  init?: RequestInit,
) => Promise<ServerResult<Expectation>>;

type Result<Fetcher, Expectation> = Promise<
  Fetcher extends ClientFetch
    ? ClientResult<Expectation>
    : Fetcher extends ServerFetch
      ? ServerResult<Expectation>
      : never
>;

export function createRequester<Fetcher extends ClientFetch | ServerFetch>(
  fetcher: Fetcher,
) {
  return {
    get: async <Expectation>(endpoint: Endpoint, init: RequestInit = {}) => {
      return (await fetcher<Expectation>(endpoint, {
        ...init,
        method: "GET",
      })) as Result<Fetcher, Expectation>;
    },
    post: async <Expectation>(
      endpoint: Endpoint,
      body: Record<string, unknown> = {},
      init: RequestInit = {},
    ) => {
      return (await fetcher<Expectation>(endpoint, {
        ...init,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          ...init.headers,
          "Content-Type": "application/json",
        },
      })) as Result<Fetcher, Expectation>;
    },
    put: async <Expectation>(
      endpoint: Endpoint,
      body: Record<string, unknown> = {},
      init: RequestInit = {},
    ) => {
      return (await fetcher<Expectation>(endpoint, {
        ...init,
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          ...init.headers,
          "Content-Type": "application/json",
        },
      })) as Result<Fetcher, Expectation>;
    },
    patch: async <Expectation>(
      endpoint: Endpoint,
      body: Record<string, unknown> = {},
      init: RequestInit = {},
    ) => {
      return (await fetcher<Expectation>(endpoint, {
        ...init,
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          ...init.headers,
          "Content-Type": "application/json",
        },
      })) as Result<Fetcher, Expectation>;
    },
    delete: async <Expectation>(endpoint: Endpoint, init: RequestInit = {}) => {
      return (await fetcher<Expectation>(endpoint, {
        ...init,
        method: "DELETE",
      })) as Result<Fetcher, Expectation>;
    },
    form: async <Expectation>(
      endpoint: Endpoint,
      body: FormData,
      init: RequestInit = {},
    ) => {
      return (await fetcher<Expectation>(endpoint, {
        method: "POST",
        ...init,
        body,
      })) as Result<Fetcher, Expectation>;
    },
  };
}
