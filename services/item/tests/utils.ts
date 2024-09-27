import app from "@/index";

/**
 * A lightweight wrapper that sends a request to the server.
 */
export async function fetcher(endpoint: string, init: RequestInit = {}) {
  const url = new URL(endpoint, "http://localhost");
  const req = new Request(url, init);
  const res = await app.fetch(req);
  return res;
}
