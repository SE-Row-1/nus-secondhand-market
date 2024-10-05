import { describe, expect, it } from "bun:test";
import { request } from "./utils";

describe("GET /", () => {
  it("returns all items by default", async () => {
    const res = await request("/");
    const body = await res.json();

    expect(res.status).toEqual(200);
    expect(body).toMatchObject({
      items: expect.any(Array),
      total: expect.any(Number),
    });
  });
});
