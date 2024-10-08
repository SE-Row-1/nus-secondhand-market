import type { Account } from "@/types";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import * as v from "valibot";

// JWT payload should contain the user's account information.
//
// Normally speaking, we trust the information carried in JWT,
// so here we only do some basic validation for types.
const accountSchema = v.object({
  id: v.number(),
  email: v.string(),
  nickname: v.nullable(v.string()),
  avatarUrl: v.nullable(v.string()),
  phoneCode: v.nullable(v.string()),
  phoneNumber: v.nullable(v.string()),
  department: v.nullable(
    v.object({
      id: v.number(),
      acronym: v.string(),
      name: v.string(),
    }),
  ),
  createdAt: v.pipe(
    v.string(),
    v.transform((value) => new Date(value)),
    v.date(),
  ),
  deletedAt: v.nullable(
    v.pipe(
      v.string(),
      v.transform((value) => new Date(value)),
      v.date(),
    ),
  ),
});

/**
 * Verify and decode a JWT token.
 */
async function verifyJwt(token: string) {
  try {
    return await verify(token, Bun.env.JWT_SECRET_KEY);
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(401, { message: error.message, cause: error });
    }

    throw new HTTPException(500, { message: "Unknown error.", cause: error });
  }
}

/**
 * Authenticate user.
 *
 * - If the user has already logged in, the user's account information
 * will be stored inside `c.var.user` for later use.
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
      // @ts-expect-error This works.
      c.set("user", undefined);

      await next();

      return;
    }

    const payload = await verifyJwt(accessToken);

    const account = await v.parseAsync(accountSchema, payload);

    // @ts-expect-error This works.
    c.set("user", account);

    await next();
  });
}
