import { decodeJwt } from "@/utils/jwt";
import { describe, expect, it } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { sign } from "jsonwebtoken";

describe("decodeJwt", () => {
  it("decodes JWT token", async () => {
    const jwt = sign("test", "secret");

    const payload = await decodeJwt(jwt);

    expect(payload).toEqual("test");
  });

  it("throws HTTPException if JWT is invalid", async () => {
    const jwt = "invalid";

    const fn = async () => await decodeJwt(jwt);

    expect(fn).toThrow(HTTPException);
  });
});
