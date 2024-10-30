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
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({}), { status: 200 }),
  );

  await createRequester("account")("/");

  expect(mockFetch).toHaveBeenLastCalledWith(
    Bun.env.ACCOUNT_SERVICE_BASE_URL + "/",
    {},
  );
});

it("returns JSON response in camel case", async () => {
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({ foo_foo: [{ bar_bar: 0 }] }), {
      status: 200,
    }),
  );

  const res = await createRequester("account")("/");

  expect(res).toEqual({ data: { fooFoo: [{ barBar: 0 }] }, error: null });
});

it("returns undefined if status is 204", async () => {
  mockFetch.mockResolvedValueOnce(new Response(null, { status: 204 }));

  const res = await createRequester("account")("/");

  expect(res).toEqual({ data: undefined, error: null });
});

it("returns HTTPException with upstream status code if not ok", async () => {
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify({ error: "test" }), { status: 400 }),
  );

  const res = await createRequester("account")("/");

  expect(res).toEqual({ data: null, error: expect.any(HTTPException) });
  expect(res.error?.status).toEqual(400);
});

it("returns HTTPException 502 if fetch fails", async () => {
  mockFetch.mockRejectedValueOnce(new Error("test"));

  const res = await createRequester("account")("/");

  expect(res).toEqual({ data: null, error: expect.any(HTTPException) });
  expect(res.error?.status).toEqual(502);
});
