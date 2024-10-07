import { expect, it } from "bun:test";
import { GET } from "../test-utils/request";

it("compresses in gzip if the client accepts gzip", async () => {
  const res = await GET("/healthz", {
    headers: {
      "Accept-Encoding": "gzip, deflate",
    },
  });

  expect(res.headers.get("Content-Encoding")).toEqual("gzip");
});

it("does not compress if the client does not accept gzip", async () => {
  const res = await GET("/healthz", {
    headers: {
      "Accept-Encoding": "deflate",
    },
  });

  expect(res.headers.get("Content-Encoding")).toBeNull();
});

it("does not compress if the client accepts nothing", async () => {
  const res = await GET("/healthz");

  expect(res.headers.get("Content-Encoding")).toBeNull();
});
