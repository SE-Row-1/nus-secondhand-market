import { expect, it } from "bun:test";
import { GET } from "../test-utils/request";

// https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
it("follows OWASP best practices", async () => {
  const res = await GET("/healthz");

  expect(res.headers.get("X-Frame-Options")).toEqual("SAMEORIGIN");
  expect(res.headers.get("X-XSS-Protection")).toEqual("0");
  expect(res.headers.get("X-Content-Type-Options")).toEqual("nosniff");
  expect(res.headers.get("Referrer-Policy")).toEqual("no-referrer");
  expect(res.headers.get("Expect-CT")).toBeNull();
  expect(res.headers.get("Cross-Origin-Opener-Policy")).toEqual("same-origin");
  expect(res.headers.get("Cross-Origin-Resource-Policy")).toEqual(
    "same-origin",
  );
  expect(res.headers.get("Server")).toBeNull();
  expect(res.headers.get("X-Powered-By")).toBeNull();
  expect(res.headers.get("X-DNS-Prefetch-Control")).toEqual("off");
  expect(res.headers.get("X-Download-Options")).toEqual("noopen");
  expect(res.headers.get("X-Permitted-Cross-Domain-Policies")).toEqual("none");
});
