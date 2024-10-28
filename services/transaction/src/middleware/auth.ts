import { snakeToCamel } from "@/utils/case";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "jsonwebtoken";
import * as v from "valibot";

// The JWT payload contains the requesting user's partial account information.
//
// As long as the JWT signature is verified,
// it is safe to trust the information carried within a JWT,
// so here we only do some basic validation on data types.
const payloadSchema = v.object({
  id: v.number("ID should be a number"),
  nickname: v.optional(
    v.nullable(v.string("Nickname should be a string")),
    null,
  ),
  avatarUrl: v.optional(
    v.nullable(v.string("Avatar URL should be a string")),
    null,
  ),
});

const decodedSecretKey = Buffer.from(Bun.env.JWT_SECRET_KEY, "base64");

/**
 * Verify and decode a JWT.
 */
async function decodeJwt(token: string) {
  return await new Promise((resolve, reject) => {
    verify(token, decodedSecretKey, (error, payload) => {
      if (!error) {
        resolve(payload);
      }

      if (error instanceof Error) {
        reject(
          new HTTPException(401, { message: error.message, cause: error }),
        );
      }

      reject(
        new HTTPException(500, {
          message: "Unknown error during identity verification",
          cause: error,
        }),
      );
    });
  });
}

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
