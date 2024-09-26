import useSWR, { type SWRConfiguration } from "swr";
import useSWRMutation, { type SWRMutationConfiguration } from "swr/mutation";

type Endpoint = `/${string}`;

async function fetcher<T>(endpoint: Endpoint, config?: RequestInit) {
  const url = process.env["NEXT_PUBLIC_API_BASE_URL"] + endpoint;

  const response = await fetch(url, config);

  if (response.status === 204) {
    return undefined as never;
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json as T;
}

export function useGetRequest<ResponseBody = unknown>(
  endpoint: Endpoint,
  swrConfig?: SWRConfiguration<ResponseBody>,
  fetcherConfig?: RequestInit,
) {
  return useSWR(
    endpoint,
    async (endpoint) => {
      return await fetcher<ResponseBody>(endpoint, {
        ...fetcherConfig,
        method: "GET",
      });
    },
    {
      ...swrConfig,
      throwOnError: false,
    },
  );
}

export function usePostRequest<RequestBody = unknown, ResponseBody = unknown>(
  endpoint: Endpoint,
  swrConfig?: SWRMutationConfiguration<ResponseBody, Error, Endpoint>,
  fetcherConfig?: RequestInit,
) {
  return useSWRMutation(
    endpoint,
    async (endpoint, { arg }: { arg: RequestBody }) => {
      return await fetcher<ResponseBody>(endpoint, {
        ...fetcherConfig,
        method: "POST",
        headers: {
          ...fetcherConfig?.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
    },
    {
      ...swrConfig,
      throwOnError: false,
    },
  );
}

export function usePutRequest<RequestBody = unknown, ResponseBody = unknown>(
  endpoint: Endpoint,
  swrConfig?: SWRMutationConfiguration<ResponseBody, Error, Endpoint>,
  fetcherConfig?: RequestInit,
) {
  return useSWRMutation(
    endpoint,
    async (endpoint, { arg }: { arg: RequestBody }) => {
      return await fetcher<ResponseBody>(endpoint, {
        ...fetcherConfig,
        method: "PUT",
        headers: {
          ...fetcherConfig?.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
    },
    {
      ...swrConfig,
      throwOnError: false,
    },
  );
}

export function usePatchRequest<RequestBody = unknown, ResponseBody = unknown>(
  endpoint: Endpoint,
  swrConfig?: SWRMutationConfiguration<ResponseBody, Error, Endpoint>,
  fetcherConfig?: RequestInit,
) {
  return useSWRMutation(
    endpoint,
    async (endpoint, { arg }: { arg: RequestBody }) => {
      return await fetcher<ResponseBody>(endpoint, {
        ...fetcherConfig,
        method: "PATCH",
        headers: {
          ...fetcherConfig?.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
    },
    {
      ...swrConfig,
      throwOnError: false,
    },
  );
}

export function useDeleteRequest<ResponseBody = unknown>(
  endpoint: Endpoint,
  swrConfig?: SWRMutationConfiguration<ResponseBody, Error, Endpoint>,
  fetcherConfig?: RequestInit,
) {
  return useSWRMutation(
    endpoint,
    async (endpoint) => {
      return await fetcher<ResponseBody>(endpoint, {
        ...fetcherConfig,
        method: "DELETE",
      });
    },
    {
      ...swrConfig,
      throwOnError: false,
    },
  );
}
