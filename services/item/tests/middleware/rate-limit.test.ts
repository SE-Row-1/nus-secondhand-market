import { expect, it } from "bun:test";
import { GET } from "../test-utils/request";

it("indicates rate limit constraints", async () => {
  const res = await GET("/healthz");

  expect(res.headers.get("RateLimit-Policy")).toEqual("10000;w=60");
  expect(res.headers.get("RateLimit-Limit")).toEqual("10000");
  expect(Number(res.headers.get("RateLimit-Remaining"))).toBeWithin(0, 10000);
  expect(Number(res.headers.get("RateLimit-Reset"))).toBeWithin(0, 61);
});
