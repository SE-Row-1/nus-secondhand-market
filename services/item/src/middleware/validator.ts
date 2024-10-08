import { snakeToCamel } from "@/utils/case";
import type { ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import { validator as honoValidator } from "hono/validator";
import { z, type ZodError, type ZodSchema } from "zod";

/**
 * Validate the data format of a particular part of an incoming request.
 */
export function validator<
  Target extends keyof ValidationTargets,
  Schema extends ZodSchema,
>(target: Target, schema: Schema) {
  return honoValidator(target, async (value) => {
    const { success, data, error } = await schema.safeParseAsync(
      snakeToCamel(value),
    );

    if (!success) {
      throw new HTTPException(400, {
        message: formatError(error),
        cause: error,
      });
    }

    return data as z.infer<Schema>;
  });
}

function formatError(error: ZodError) {
  const { path, message } = error.issues[0]!;
  return `[${path.join(".")}] ${message}`;
}
