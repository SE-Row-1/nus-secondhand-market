import { describe, expect, it } from "bun:test";
import { GET } from "./test-utils/request";

describe("Health check endpoint", () => {
  it("always returns 200", async () => {
    const res = await GET("/healthz");

    expect(res.status).toEqual(200);
  });
});

describe("Not found endpoint", () => {
  it("returns custom error message", async () => {
    const res = await GET("/not-found");
    const body = await res.json();

    expect(res.status).toEqual(404);
    expect(body).toEqual({ error: expect.any(String) });
  });
});
