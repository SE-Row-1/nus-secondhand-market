import type { ValidationTargets } from "hono";
import { validator as honoValidator } from "hono/validator";
import type { z, ZodError, ZodSchema } from "zod";

/**
 * Validate a particular part of an incoming request.
 *
 * @param target Which part of the request to validate.
 * @param schema A Zod schema against which the target will be validated.
 * @returns The middleware to validate the request.
 */
export function validator<
  Target extends keyof ValidationTargets,
  Schema extends ZodSchema,
>(target: Target, schema: Schema) {
  return honoValidator(target, async (value, c) => {
    const { success, data, error } = await schema.safeParseAsync(value);

    if (!success) {
      return c.json({ error: buildErrorMessage(error) }, 400);
    }

    return data as z.infer<Schema>;
  });
}

function buildErrorMessage(error: ZodError) {
  const { path, message } = error.issues[0]!;
  return `[${path.join(".")}] ${message}`;
}
