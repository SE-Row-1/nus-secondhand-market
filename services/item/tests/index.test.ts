import { describe, expect, it } from "bun:test";
import { request } from "./utils";

describe("GET /healthz", () => {
  it("always return 200", async () => {
    const res = await request("/healthz");

    expect(res.status).toEqual(200);
  });
});

describe("Compression", () => {
  it("compresses in gzip when the client accepts gzip", async () => {
    const res = await request("/healthz", {
      headers: {
        "Accept-Encoding": "gzip",
      },
    });

    expect(res.headers.get("Content-Encoding")).toEqual("gzip");
  });

  it("does not compress when the client does not accept gzip", async () => {
    const res = await request("/healthz", {
      headers: {
        "Accept-Encoding": "deflate, br",
      },
    });

    expect(res.headers.get("Content-Encoding")).toBeNull();
  });

  it("does not compress when the client does not accept any encodings", async () => {
    const res = await request("/healthz");

    expect(res.headers.get("Content-Encoding")).toBeNull();
  });
});

describe("CORS", () => {
  it("sets the correct CORS headers", async () => {
    const res = await request("/healthz");

    expect(res.headers.get("Access-Control-Allow-Origin")).toEqual("*");
    expect(res.headers.get("Access-Control-Allow-Credentials")).toEqual("true");
  });
});

describe("Rate limit", () => {
  it("sets the correct rate limit headers", async () => {
    const res = await request("/healthz");

    expect(res.headers.get("RateLimit-Policy")).toEqual("100;w=60");
    expect(res.headers.get("RateLimit-Limit")).toEqual("100");
    expect(Number(res.headers.get("RateLimit-Remaining"))).toBeWithin(0, 100);
    expect(Number(res.headers.get("RateLimit-Reset"))).toBeWithin(0, 61);
  });
});

describe("Secure headers", () => {
  it("sets the correct security headers", async () => {
    const res = await request("/healthz");

    expect(res.headers.get("Cross-Origin-Resource-Policy")).toEqual(
      "same-origin",
    );
    expect(res.headers.get("Cross-Origin-Opener-Policy")).toEqual(
      "same-origin",
    );
    expect(res.headers.get("Referrer-Policy")).toEqual("no-referrer");
    expect(res.headers.get("X-Content-Type-Options")).toEqual("nosniff");
    expect(res.headers.get("X-DNS-Prefetch-Control")).toEqual("off");
    expect(res.headers.get("X-Download-Options")).toEqual("noopen");
    expect(res.headers.get("X-Frame-Options")).toEqual("SAMEORIGIN");
    expect(res.headers.get("X-Permitted-Cross-Domain-Policies")).toEqual(
      "none",
    );
    expect(res.headers.get("X-XSS-Protection")).toEqual("0");
  });
});
