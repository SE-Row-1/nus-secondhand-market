import { describe, expect, it, mock } from "bun:test";
import { request } from "./utils";

mock.module("@/utils/db", () => ({
  itemsRepository: {
    find: () => ({
      toArray: () => [],
    }),
  },
}));

describe("GET /", () => {
  it("should return all items", async () => {
    const res = await request("/");
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([]);
  });
});
