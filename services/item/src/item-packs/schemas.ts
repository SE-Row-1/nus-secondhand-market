import * as v from "valibot";

export const composeJsonSchema = v.object({
  name: v.pipe(
    v.string("name should be a string"),
    v.minLength(1, "name should be at least 1 character long"),
    v.maxLength(50, "name should be at most 50 characters long"),
  ),
  description: v.pipe(
    v.string("description should be a string"),
    v.minLength(1, "description should be at least 1 character long"),
    v.maxLength(500, "description should be at most 500 characters long"),
  ),
  discount: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number("discount should be a number"),
      v.minValue(0, "discount should be at least 0"),
      v.maxValue(1, "discount should be at most 1"),
    ),
    0,
  ),
  childrenIds: v.pipe(
    v.array(
      v.pipe(
        v.string("children_id should be a string"),
        v.uuid("children_id should be a UUID"),
      ),
      "children_ids should be an array",
    ),
    v.minLength(2, "children_ids should have at least 2 items"),
  ),
});

export const decomposeParamSchema = v.object({
  id: v.pipe(v.string("id should be a string"), v.uuid("id should be a UUID")),
});
