import { HTTPException } from "hono/http-exception";
import { verify } from "jsonwebtoken";

const secretKey = Buffer.from(Bun.env.JWT_SECRET_KEY, "base64");

export async function decodeJwt(jwt: string) {
  return await new Promise((resolve, reject) => {
    verify(jwt, secretKey, (error, payload) => {
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
          message: "Unknown error when decoding JWT",
          cause: error,
        }),
      );
    });
  });
}
