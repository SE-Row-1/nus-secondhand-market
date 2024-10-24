import { cookies } from "next/headers";
import { logger } from "../../utils/logger";
import { HttpError } from "./http-error";
import type { Endpoint, Fetcher } from "./types";

export class ServerFetcher implements Fetcher {
  public async fetch<T>(endpoint: Endpoint, init: RequestInit = {}) {
    try {
      const url = process.env.API_BASE_URL + endpoint;

      const cookieStore = await cookies();

      const res = await fetch(url, {
        signal: AbortSignal.timeout(3000),
        ...init,
        headers: {
          Cookie: cookieStore.toString(),
          ...init.headers,
        },
      });

      if (res.status === 204) {
        return undefined as T;
      }

      const json = await res.json();

      if (!res.ok) {
        throw new HttpError(res.status, json.error);
      }

      return json as T;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "TimeoutError") {
        logger.error(`server request to "${endpoint}" timed out`);
        throw new HttpError(504, "Request timed out");
      }

      if (error instanceof Error) {
        logger.error(
          `server request to "${endpoint}" failed: ${error.message}`,
        );
        throw new HttpError(502, error.message);
      }

      logger.error(`server request to "${endpoint}" failed: ${error}`);
      throw new HttpError(500, "Unknown error");
    }
  }
}
