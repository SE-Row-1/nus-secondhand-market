import app from "@/index";
import { describe, expect, it } from "bun:test";

describe("GET /healthz", () => {
  it("should return 200", async () => {
    const res = await app.request("/healthz");
    expect(res.status).toEqual(200);
  });
});
