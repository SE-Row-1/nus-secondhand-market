import { HTTPException } from "hono/http-exception";

const serviceRegistry = {
  account: Bun.env.ACCOUNT_SERVICE_BASE_URL,
};

export function createRequester(service: keyof typeof serviceRegistry) {
  const baseUrl = serviceRegistry[service];

  return async <T>(endpoint: string, init: RequestInit = {}) => {
    const res = await fetch(baseUrl + endpoint, init);

    if (res.status === 204) {
      return undefined as never;
    }

    const json = await res.json();

    if (!res.ok) {
      const message = (json as { error: string }).error;
      throw new HTTPException(502, {
        message: `Service ${service} responded with ${res.status}: ${message}`,
      });
    }

    return json as T;
  };
}
