export async function fetcher<T>(url: string, config?: RequestInit) {
  const input = new URL(url, process.env["NEXT_PUBLIC_API_BASE_URL"]);

  const init = {
    headers: {
      ...config?.headers,
      "Content-Type": "application/json",
    },
    ...config,
  };

  const response = await fetch(input, init);

  if (response.status === 204) {
    return undefined as never;
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }

  return json as T;
}
