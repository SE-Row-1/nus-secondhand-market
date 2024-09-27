import { describe, expect, it } from "bun:test";
import { fetcher } from "./utils";

describe("GET /healthz", () => {
  it("should return 200", async () => {
    const res = await fetcher("/healthz");
    expect(res.status).toEqual(200);
  });
});
