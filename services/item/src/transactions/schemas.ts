import * as v from "valibot";

export const getAllQuerySchema = v.object({
  itemId: v.optional(
    v.pipe(
      v.string("item_id should be a string"),
      v.uuid("item_id should be a UUID"),
    ),
  ),
  excludeCancelled: v.optional(
    v.pipe(
      v.unknown(),
      v.transform((value) => value === "true"),
      v.boolean("exclude_cancelled should be a boolean"),
    ),
    false,
  ),
});
