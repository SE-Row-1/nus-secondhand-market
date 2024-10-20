import * as v from "valibot";

export const composeJsonSchema = v.object({
  name: v.pipe(
    v.string("Name should be a string"),
    v.minLength(1, "Name should be at least 1 character long"),
    v.maxLength(50, "Name should be at most 50 characters long"),
  ),
  description: v.pipe(
    v.string("Description should be a string"),
    v.minLength(1, "Description should be at least 1 character long"),
    v.maxLength(500, "Description should be at most 500 characters long"),
  ),
  discount: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number("Discount should be a number"),
      v.minValue(0, "Discount should be at least 0"),
      v.maxValue(1, "Discount should be at most 1"),
    ),
    0,
  ),
  childrenIds: v.pipe(
    v.array(
      v.pipe(
        v.string("Children ID should be a string"),
        v.uuid("Children ID should be a UUID"),
      ),
      "Children IDs should be an array",
    ),
    v.minLength(2, "Compose at least 2 items"),
  ),
});
