import app from "@/index";

const honoEnv = {
  server: {
    requestIP: () => ({
      address: "localhost",
      port: 8080,
    }),
  },
};

export async function GET(endpoint: string, init: RequestInit = {}) {
  return await app.request(
    endpoint,
    {
      method: "GET",
      ...init,
    },
    honoEnv,
  );
}

export async function POST(
  endpoint: string,
  body: Record<string, unknown>,
  init: RequestInit = {},
) {
  return await app.request(
    endpoint,
    {
      method: "POST",
      body: JSON.stringify(body),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    },
    honoEnv,
  );
}

export async function PUT(
  endpoint: string,
  body: Record<string, unknown>,
  init: RequestInit = {},
) {
  return await app.request(
    endpoint,
    {
      method: "PUT",
      body: JSON.stringify(body),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    },
    honoEnv,
  );
}

export async function PATCH(
  endpoint: string,
  body: Record<string, unknown>,
  init: RequestInit = {},
) {
  return await app.request(
    endpoint,
    {
      method: "PATCH",
      body: JSON.stringify(body),
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    },
    honoEnv,
  );
}

export async function DELETE(endpoint: string, init: RequestInit = {}) {
  return await app.request(
    endpoint,
    {
      method: "DELETE",
      ...init,
    },
    honoEnv,
  );
}
