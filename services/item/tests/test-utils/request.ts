import app from "@/index";

const honoEnv = {
  server: {
    requestIP: () => ({
      address: "localhost",
      port: 8080,
    }),
  },
};

/**
 * Fake a GET request.
 */
export async function GET(endpoint: string, init: RequestInit = {}) {
  return await app.request(
    endpoint,
    {
      ...init,
      method: "GET",
    },
    honoEnv,
  );
}

/**
 * Fake a POST request.
 */
export async function POST(
  endpoint: string,
  body: Record<string, unknown>,
  init: RequestInit = {},
) {
  return await app.request(
    endpoint,
    {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...init.headers,
        "Content-Type": "application/json",
      },
    },
    honoEnv,
  );
}

/**
 * Fake a POST request with `multipart/form-data`.
 */
export async function FORM(
  endpoint: string,
  formData: FormData,
  init: RequestInit = {},
) {
  return await app.request(
    endpoint,
    {
      ...init,
      method: "POST",
      body: formData,
    },
    honoEnv,
  );
}

/**
 * Fake a PUT request.
 */
export async function PUT(
  endpoint: string,
  body: Record<string, unknown>,
  init: RequestInit = {},
) {
  return await app.request(
    endpoint,
    {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        ...init.headers,
        "Content-Type": "application/json",
      },
    },
    honoEnv,
  );
}

/**
 * Fake a PATCH request.
 */
export async function PATCH(
  endpoint: string,
  body: Record<string, unknown>,
  init: RequestInit = {},
) {
  return await app.request(
    endpoint,
    {
      ...init,
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        ...init.headers,
        "Content-Type": "application/json",
      },
    },
    honoEnv,
  );
}

/**
 * Fake a DELETE request.
 */
export async function DELETE(endpoint: string, init: RequestInit = {}) {
  return await app.request(
    endpoint,
    {
      ...init,
      method: "DELETE",
    },
    honoEnv,
  );
}
