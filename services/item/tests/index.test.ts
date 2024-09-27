import { describe, expect, it } from "bun:test";
import { fetcher } from "./utils";

describe("GET /", () => {
  it("should return 200", async () => {
    const res = await fetcher("/");
    expect(res.status).toEqual(200);
  });
});
