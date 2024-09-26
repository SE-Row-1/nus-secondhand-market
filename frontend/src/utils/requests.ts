async function fetcher<T>(endpoint: string, config?: RequestInit) {
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

export const requests = {
  get: async <T>(endpoint: string, config: RequestInit = {}) => {
    return await fetcher<T>(endpoint, {
      ...config,
      method: "GET",
    });
  },
  post: async <T>(
    endpoint: string,
    body: unknown = {},
    config: RequestInit = {},
  ) => {
    return await fetcher<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...config?.headers,
        "Content-Type": "application/json",
      },
    });
  },
  put: async <T>(
    endpoint: string,
    body: unknown = {},
    config: RequestInit = {},
  ) => {
    return await fetcher<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        ...config?.headers,
        "Content-Type": "application/json",
      },
    });
  },
  patch: async <T>(
    endpoint: string,
    body: unknown = {},
    config: RequestInit = {},
  ) => {
    return await fetcher<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        ...config?.headers,
        "Content-Type": "application/json",
      },
    });
  },
  delete: async <T>(endpoint: string, config: RequestInit = {}) => {
    return await fetcher<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  },
};
