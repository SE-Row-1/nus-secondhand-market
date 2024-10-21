import { cookies } from "next/headers";
import { logger } from "../logger";
import { HttpError } from "./http-error";
import { createRequester } from "./requester";

async function serverFetch<T>(endpoint: string, init: RequestInit = {}) {
  logger.http(`server request to ${endpoint}`);

  try {
    const url = process.env.API_BASE_URL + endpoint;

    const res = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        Cookie: cookies().toString(),
      },
      signal: AbortSignal.timeout(3000),
    });

    if (res.status === 204) {
      return { data: undefined as T, error: null };
    }

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: new HttpError(res.status, json.error) };
    }

    return { data: json as T, error: null };
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      logger.error(`server request to ${endpoint} timed out`);
      return { data: null, error: new HttpError(504, "Request timed out") };
    }

    if (error instanceof Error) {
      logger.error(`server request to ${endpoint} failed: ${error.message}`);
      return { data: null, error: new HttpError(500, error.message) };
    }

    logger.error(`server request to ${endpoint} failed: ${error}`);
    return { data: null, error: new HttpError(500, "Unknown error") };
  }
}

export const serverRequester = createRequester(serverFetch);
