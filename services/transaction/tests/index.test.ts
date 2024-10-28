import { describe, expect, it } from "bun:test";
import { GET } from "./test-utils/request";

describe("Health check endpoint", () => {
  it("always returns 200", async () => {
    const res = await GET("/healthz");

    expect(res.status).toEqual(200);
  });
});
