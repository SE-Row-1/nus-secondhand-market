import { HttpError } from "./http-error";
import { createRequester } from "./requester";

async function clientFetch<T>(endpoint: string, init: RequestInit = {}) {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL + endpoint;

  const res = await fetch(url, init);

  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, json.error);
  }

  return json as T;
}

export const clientRequester = createRequester(clientFetch);
