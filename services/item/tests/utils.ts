import app from "@/index";

/**
 * Fake a request to the server.
 */
export async function request(endpoint: string, init: RequestInit = {}) {
  const res = await app.request(endpoint, init, {
    server: {
      requestIP: () => ({
        address: "localhost",
        port: 8080,
      }),
    },
  });

  return res;
}
