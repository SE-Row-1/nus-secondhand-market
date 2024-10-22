import { createRequester } from "@/utils/requester";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";

const myFetch = mock();

beforeAll(() => {
  global.fetch = myFetch;
});

afterAll(() => {
  mock.restore();
});

it("concatenates endpoint with the right base URL", async () => {
  myFetch.mockImplementationOnce(
    async () => new Response("{}", { status: 200 }),
  );

  await createRequester("account")("/accounts/1");

  expect(myFetch).toHaveBeenCalledWith(
    Bun.env.ACCOUNT_SERVICE_BASE_URL + "/accounts/1",
    {},
  );
});

it("returns JSON response if successful", async () => {
  myFetch.mockImplementationOnce(
    async () => new Response('{ "test": [0] }', { status: 200 }),
  );

  const result = await createRequester("account")("/");

  expect(result).toEqual({ test: [0] });
});

it("returns undefined if status is 204", async () => {
  myFetch.mockImplementationOnce(
    async () => new Response(null, { status: 204 }),
  );

  const result = await createRequester("account")("/");

  expect(result).toBeUndefined();
});

it("throws HTTPException if not successful", async () => {
  myFetch.mockImplementationOnce(
    async () => new Response('{ "error": "test" }', { status: 400 }),
  );

  const fn = async () => await createRequester("account")("/");

  expect(fn).toThrow(new HTTPException(400, { message: "test" }));
});
