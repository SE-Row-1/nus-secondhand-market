import { snakeToCamel } from "@/utils/case";
import { decodeJwt } from "@/utils/jwt";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";

const payloadSchema = v.object({
  id: v.number("jwt.id should be a number"),
  email: v.string("jwt.email should be a string"),
  nickname: v.optional(
    v.nullable(v.string("jwt.nickname should be a string")),
    null,
  ),
  avatarUrl: v.optional(
    v.nullable(v.string("jwt.avatar_url should be a string")),
    null,
  ),
});

/**
 * Authenticate user.
 *
 * - If the user has already logged in, the user's information will be stored
 * inside `c.var.user` for later use.
 * - If the user has not yet logged in, and `strict = true`, the middleware
 * will directly return 401.
 * - If the user has not yet logged in, and `strict = false`, `c.var.user`
 * will be set to `undefined`.
 */
export function auth<Strict extends boolean>(strict: Strict) {
  return createMiddleware<{
    Variables: {
      user: Strict extends true
        ? v.InferOutput<typeof payloadSchema>
        : v.InferOutput<typeof payloadSchema> | undefined;
    };
  }>(async (c, next) => {
    const accessToken = getCookie(c, "access_token");

    if (accessToken === undefined && strict) {
      throw new HTTPException(401, { message: "Please log in first" });
    }

    if (accessToken === undefined) {
      // @ts-expect-error This works.
      c.set("user", undefined);

      await next();

      return;
    }

    const payload = await decodeJwt(accessToken);

    const user = await v.parseAsync(payloadSchema, snakeToCamel(payload));

    // @ts-expect-error This works.
    c.set("user", user);

    await next();
  });
}
