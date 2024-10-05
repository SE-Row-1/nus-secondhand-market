import { describe, expect, it, mock } from "bun:test";
import { request } from "./utils";

mock.module("@/utils/db", () => ({
  itemsCollection: {
    find: () => ({
      toArray: () => [],
    }),
  },
}));

describe("GET /", () => {
  it("returns 20 items from the start by default", async () => {
    const res = await request("/");
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([]);
  });
});
