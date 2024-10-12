import { expect, it } from "bun:test";
import { GET } from "../test-utils/request";

it("allows any origin in non-production", async () => {
  const origins = ["http://localhost:3000", "https://example.com"];

  for (const origin of origins) {
    const res = await GET("/healthz", {
      headers: {
        Origin: origin,
      },
    });

    expect(res.headers.get("Access-Control-Allow-Origin")).toEqual(origin);
    expect(res.headers.get("Access-Control-Allow-Credentials")).toEqual("true");
  }
});
