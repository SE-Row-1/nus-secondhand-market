import { describe, expect, it } from "bun:test";
import { GET } from "./test-utils/request";

describe("GET /healthz", () => {
  it("always returns 200", async () => {
    const res = await GET("/healthz");

    expect(res.status).toEqual(200);
  });
});
