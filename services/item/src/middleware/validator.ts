import { snakeToCamel } from "@/utils/case";
import type { ValidationTargets } from "hono";
import { validator as honoValidator } from "hono/validator";
import * as v from "valibot";

/**
 * Validate the data format of a particular part of an incoming request.
 */
export function validator<
  Target extends keyof ValidationTargets,
  Schema extends v.GenericSchema,
>(target: Target, schema: Schema) {
  return honoValidator(target, async (value) => {
    return await v.parseAsync(schema, snakeToCamel(value));
  });
}
