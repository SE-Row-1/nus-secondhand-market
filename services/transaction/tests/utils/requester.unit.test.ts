import { createRequester } from "@/utils/requester";
import { afterEach, beforeEach, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";

const mockFetch = mock();

beforeEach(() => {
  global.fetch = mockFetch;
});

afterEach(() => {
  mock.restore();
});

it("concatenates endpoint with the right base URL", async () => {
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({}), { status: 200 }),
  );

  await createRequester("account")("/accounts/1");

  expect(mockFetch).toHaveBeenLastCalledWith(
    Bun.env.ACCOUNT_SERVICE_BASE_URL + "/accounts/1",
    {},
  );
});

it("returns camel-case JSON response", async () => {
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({ foo_bar: [0] }), { status: 200 }),
  );

  const res = await createRequester("account")("/");

  expect(res).toEqual({ data: { fooBar: [0] }, error: null });
});

it("returns undefined if status is 204", async () => {
  mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

  const res = await createRequester("account")("/");

  expect(res).toEqual({ data: undefined, error: null });
});

it("returns HTTPException if not ok", async () => {
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({ error: "test" }), { status: 400 }),
  );

  const res = await createRequester("account")("/");

  expect(res).toEqual({ data: null, error: expect.any(HTTPException) });
});

it("returns HTTPException if fetch fails", async () => {
  mockFetch.mockRejectedValueOnce("test");

  const res = await createRequester("account")("/");

  expect(res).toEqual({ data: null, error: expect.any(HTTPException) });
});
