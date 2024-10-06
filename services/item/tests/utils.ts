import app from "@/index";

/**
 * Fake a request to the server.
 */
export async function request(
  endpoint: string,
  init: RequestInit = {},
  contentType: "json" | "form" = "json",
) {
  const res = await app.request(
    endpoint,
    {
      ...init,
      headers: {
        ...(contentType === "json"
          ? { "Content-Type": "application/json" }
          : {}),
        ...init.headers,
      },
    },
    {
      server: {
        requestIP: () => ({
          address: "localhost",
          port: 8080,
        }),
      },
    },
  );

  return res;
}
