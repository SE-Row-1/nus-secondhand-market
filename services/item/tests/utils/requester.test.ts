import { createRequester } from "@/utils/requester";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";

const mockFetch = mock();

beforeAll(() => {
  global.fetch = mockFetch;
});

afterAll(() => {
  mock.restore();
});

function mockResponse(status: number, json: unknown) {
  mockFetch.mockImplementationOnce(
    async () => new Response(JSON.stringify(json), { status }),
  );
}

it("concatenates endpoint with the right base URL", async () => {
  mockResponse(200, {});

  await createRequester("account")("/accounts/1");

  expect(mockFetch).toHaveBeenCalledWith(
    Bun.env.ACCOUNT_SERVICE_BASE_URL + "/accounts/1",
    {},
  );
});

it("returns JSON response", async () => {
  mockResponse(200, { test: [0] });

  const res = await createRequester("account")("/");

  expect(res).toEqual({ test: [0] });
});

it("returns undefined if status is 204", async () => {
  mockResponse(204, null);

  const res = await createRequester("account")("/");

  expect(res).toBeUndefined();
});

it("throws HTTPException if fails", async () => {
  mockResponse(400, { error: "test" });

  const fn = async () => await createRequester("account")("/");

  expect(fn).toThrow(HTTPException);
});
