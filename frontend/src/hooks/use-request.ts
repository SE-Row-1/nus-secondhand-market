import useSWR from "swr";
import useSWRMutation from "swr/mutation";

type Endpoint = `/${string}`;

async function fetcher<T>(endpoint: Endpoint, config?: RequestInit) {
  const url = new URL(endpoint, process.env["NEXT_PUBLIC_API_BASE_URL"]);

  const withAccessTokenConfig = attachAccessToken(config);

  const response = await fetch(url, withAccessTokenConfig);

  if (response.status === 204) {
    return undefined as never;
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json as T;
}

function attachAccessToken(config?: RequestInit) {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    return {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  return config;
}

export function useGetRequest<ResponseBody = unknown>(
  endpoint: Endpoint,
  config?: RequestInit,
) {
  return useSWR(endpoint, async (endpoint) => {
    return await fetcher<ResponseBody>(endpoint, {
      ...config,
      method: "GET",
    });
  });
}

export function usePostRequest<RequestBody = unknown, ResponseBody = unknown>(
  endpoint: Endpoint,
  config?: RequestInit,
) {
  return useSWRMutation(
    endpoint,
    async (endpoint, { arg }: { arg: RequestBody }) => {
      return await fetcher<ResponseBody>(endpoint, {
        ...config,
        method: "POST",
        headers: {
          ...config?.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
    },
  );
}

export function usePutRequest<RequestBody = unknown, ResponseBody = unknown>(
  endpoint: Endpoint,
  config?: RequestInit,
) {
  return useSWRMutation(
    endpoint,
    async (endpoint, { arg }: { arg: RequestBody }) => {
      return await fetcher<ResponseBody>(endpoint, {
        ...config,
        method: "PUT",
        headers: {
          ...config?.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
    },
  );
}

export function usePatchRequest<RequestBody = unknown, ResponseBody = unknown>(
  endpoint: Endpoint,
  config?: RequestInit,
) {
  return useSWRMutation(
    endpoint,
    async (endpoint, { arg }: { arg: RequestBody }) => {
      return await fetcher<ResponseBody>(endpoint, {
        ...config,
        method: "PATCH",
        headers: {
          ...config?.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arg),
      });
    },
  );
}

export function useDeleteRequest<ResponseBody = unknown>(
  endpoint: Endpoint,
  config?: RequestInit,
) {
  return useSWRMutation(endpoint, async (endpoint) => {
    return await fetcher<ResponseBody>(endpoint, {
      ...config,
      method: "DELETE",
    });
  });
}
