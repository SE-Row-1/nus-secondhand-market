import { cookies } from "next/headers";
import { HttpError } from "./http-error";
import { createRequester } from "./requester";

async function serverFetch<T>(endpoint: string, init: RequestInit = {}) {
  try {
    const url = process.env.API_BASE_URL + endpoint;

    const res = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        Cookie: cookies().toString(),
      },
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
    console.error("Error when requesting for endpoint:", endpoint);

    if (error instanceof Error) {
      return { data: null, error: new HttpError(500, error.message) };
    }

    return { data: null, error: new HttpError(500, "Unknown error") };
  }
}

export const serverRequester = createRequester(serverFetch);
