import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";

const serviceRegistry = {
  account: Bun.env.ACCOUNT_SERVICE_BASE_URL,
};

/**
 * Create a requester towards another microservice.
 */
export function createRequester(service: keyof typeof serviceRegistry) {
  const baseUrl = serviceRegistry[service];

  return async <T>(endpoint: `/${string}`, init: RequestInit = {}) => {
    const res = await fetch(baseUrl + endpoint, init);

    if (res.status === 204) {
      return undefined as T;
    }

    const json = await res.json();

    if (!res.ok) {
      throw new HTTPException(res.status as StatusCode, {
        message: (json as { error: string }).error,
      });
    }

    return json as T;
  };
}
