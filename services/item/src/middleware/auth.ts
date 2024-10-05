import type { Account } from "@/types";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

/**
 * Authenticate user.
 *
 * - If the user has already logged in, the user's account will be stored
 * inside `c.var.user` for later use.
 * - If the user has not yet logged in, and `strict = true`, the middleware
 * will directly return 401.
 * - If the user has not yet logged in, and `strict = false`, `c.var.user`
 * will be set to `undefined`.
 *
 * @param strict Whether the user must log in to pass the auth check.
 */
export function auth<Strict extends boolean>(strict: Strict) {
  return createMiddleware<{
    Variables: { user: Strict extends true ? Account : Account | undefined };
  }>(async (c, next) => {
    const accessToken = getCookie(c, "access_token");

    if (accessToken === undefined && strict) {
      throw new HTTPException(401, { message: "Please log in first." });
    }

    if (accessToken === undefined) {
      // @ts-expect-error This actually works.
      c.set("user", undefined);
      return await next();
    }

    const user = await verifyJwt(accessToken);

    // @ts-expect-error This actually works.
    c.set("user", user);
    return await next();
  });
}

/**
 * Verify and decode a JWT token.
 *
 * Claims are automatically removed from the payload.
 *
 * @param token The incoming JWT token.
 * @returns The payload of the JWT token.
 */
async function verifyJwt(token: string) {
  try {
    const payload = await verify(token, Bun.env.JWT_SECRET);

    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;

    return payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(401, error);
    }

    console.error(error);
    throw new HTTPException(500, { message: "Unknown error" });
  }
}
