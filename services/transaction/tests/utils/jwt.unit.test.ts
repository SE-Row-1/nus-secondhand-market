import { decodeJwt } from "@/utils/jwt";
import { describe, expect, it } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { sign } from "jsonwebtoken";

describe("decodeJwt", () => {
  it("decodes JWT token", async () => {
    const jwt = sign("test", Buffer.from(Bun.env.JWT_SECRET_KEY, "base64"));

    const payload = await decodeJwt(jwt);

    expect(payload).toEqual("test");
  });

  it("throws HTTPException 401 if JWT is invalid", async () => {
    const jwt = "invalid";

    const fn = async () => await decodeJwt(jwt);

    expect(fn).toThrow(HTTPException);
    expect(fn).toThrowError(expect.objectContaining({ status: 401 }));
  });
});
