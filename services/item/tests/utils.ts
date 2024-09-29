import app from "@/index";

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
