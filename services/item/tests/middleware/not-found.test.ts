import { expect, it } from "bun:test";
import { GET } from "../test-utils/request";

it("returns 404 for unknown endpoints", async () => {
  const res = await GET("/foo");
  const body = await res.json();

  expect(res.status).toEqual(404);
  expect(body).toMatchObject({ error: expect.any(String) });
});
