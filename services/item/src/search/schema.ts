import * as v from "valibot";

export const searchQuerySchema = v.object({
  q: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
  limit: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.integer(),
      v.minValue(1),
      v.maxValue(100),
    ),
    8,
  ),
  cursor: v.optional(v.pipe(v.string(), v.regex(/^[0-9a-f]{24}$/))),
  threshold: v.optional(
    v.pipe(v.unknown(), v.transform(Number), v.number(), v.minValue(0)),
  ),
});
