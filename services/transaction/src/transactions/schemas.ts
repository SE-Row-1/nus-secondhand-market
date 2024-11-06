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
    ),
    false,
  ),
});

export const createJsonSchema = v.object({
  itemId: v.pipe(
    v.string("item_id should be a string"),
    v.uuid("item_id should be a UUID"),
  ),
  buyerId: v.pipe(
    v.unknown(),
    v.transform(Number),
    v.integer("buyer_id should be an integer"),
    v.minValue(1, "buyer_id should be at least 1"),
  ),
});

export const transitionParamSchema = v.object({
  id: v.pipe(v.string("id should be a string"), v.uuid("id should be a UUID")),
  action: v.union(
    [v.literal("complete"), v.literal("cancel")],
    'action should be either "complete" or "cancel"',
  ),
});
