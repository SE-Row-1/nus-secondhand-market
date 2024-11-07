import { createRequester } from "@/utils/requester";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";

const mockFetch = spyOn(global, "fetch");

afterEach(() => {
  mockFetch.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("concatenates endpoint with correct base URL", async () => {
  mockFetch.mockResolvedValueOnce(Response.json({}, { status: 200 }));

  await createRequester("account")("/accounts/1");

  expect(mockFetch).toHaveBeenLastCalledWith(
    Bun.env.ACCOUNT_SERVICE_BASE_URL + "/accounts/1",
    {},
  );
});

it("returns camelCase JSON response", async () => {
  mockFetch.mockResolvedValueOnce(
    Response.json({ foo_foo: [{ bar_bar: 0 }] }, { status: 200 }),
  );

  const res = await createRequester("account")("/");

  expect(res).toEqual({ fooFoo: [{ barBar: 0 }] });
});

it("returns undefined if status is 204", async () => {
  mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

  const res = await createRequester("account")("/");

  expect(res).toEqual(undefined);
});

it("throws HTTPException with upstream information if not ok", async () => {
  mockFetch.mockResolvedValueOnce(
    Response.json({ error: "test" }, { status: 400 }),
  );

  const promise = createRequester("account")("/");

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 400);
  expect(promise).rejects.toHaveProperty("message", "test");
});

it("throws Error if fetch fails", async () => {
  mockFetch.mockRejectedValueOnce(new Error("test"));

  const promise = createRequester("account")("/");

  expect(promise).rejects.toBeInstanceOf(Error);
  expect(promise).rejects.toHaveProperty("message", "test");
});
