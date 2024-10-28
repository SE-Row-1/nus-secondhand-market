import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import { snakeToCamel } from "./case";

/**
 * Register every microservice's base URL here.
 */
const serviceRegistry = {
  account: Bun.env.ACCOUNT_SERVICE_BASE_URL,
  item: Bun.env.ITEM_SERVICE_BASE_URL,
};

/**
 * Requesters created by this function are used exclusively
 * for inter-microservice HTTP communication.
 */
export function createRequester(service: keyof typeof serviceRegistry) {
  const baseUrl = serviceRegistry[service];

  return async <T>(endpoint: `/${string}`, init: RequestInit = {}) => {
    try {
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

      return snakeToCamel(json) as T;
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      console.error(error);
      throw new HTTPException(500, {
        message: `Error when requesting endpoint ${endpoint}`,
      });
    }
  };
}
