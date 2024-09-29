import { describe, expect, it } from "bun:test";
import { request } from "./utils";

describe("GET /healthz", () => {
  it("should return 200", async () => {
    const res = await request("/healthz");
    expect(res.status).toEqual(200);
  });
});
