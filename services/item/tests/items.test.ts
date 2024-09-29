import app from "@/index";
import { describe, expect, it, mock } from "bun:test";

mock.module("@/utils/db", () => ({
  itemsCollection: {
    find: () => ({
      toArray: () => [],
    }),
  },
}));

describe("GET /", () => {
  it("should return all items", async () => {
    const res = await app.request("/");
    expect(res.status).toEqual(200);
    expect(await res.json()).toEqual([]);
  });
});
