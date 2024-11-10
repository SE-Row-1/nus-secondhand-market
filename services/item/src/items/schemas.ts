import { ItemStatus, ItemType } from "@/types";
import * as v from "valibot";

export const getAllQuerySchema = v.object({
  type: v.optional(v.enum(ItemType, "type is invalid")),
  status: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.enum(ItemStatus, "status is invalid"),
    ),
  ),
  sellerId: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.integer("seller_id should be an integer"),
      v.minValue(1, "seller_id should be at least 1"),
    ),
  ),
  limit: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.integer("limit should be an integer"),
      v.minValue(1, "limit should be at least 1"),
      v.maxValue(100, "limit should be at most 100"),
    ),
    10,
  ),
  cursor: v.optional(
    v.pipe(
      v.string("cursor should be a string"),
      v.regex(/^[0-9a-f]{24}$/, "cursor is invalid"),
    ),
  ),
});

export const getOneParamSchema = v.object({
  id: v.pipe(v.string("id should be a string"), v.uuid("id should be a UUID")),
});

const fileSchema = v.pipe(
  v.file("Not a file"),
  v.mimeType(
    ["image/jpeg", "image/png", "image/webp", "image/avif"],
    "Unsupported image format",
  ),
  v.maxSize(5 * 1024 * 1024, "Image size should not exceed 5MB"),
);

export const publishFormSchema = v.object({
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
  price: v.pipe(
    v.unknown(),
    v.transform(Number),
    v.number("price should be a number"),
    v.minValue(0, "price should be at least 0"),
  ),
  photos: v.optional(
    v.union([
      v.pipe(v.array(fileSchema), v.maxLength(5, "Only allow up to 5 images")),
      v.pipe(
        fileSchema,
        v.transform((file) => [file]),
      ),
    ]),
    [],
  ),
});

export const updateParamSchema = v.object({
  id: v.pipe(v.string("id should be a string"), v.uuid("id should be a UUID")),
});

export const updateFormSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string("name should be a string"),
      v.minLength(1, "name should be at least 1 character long"),
      v.maxLength(50, "name should be at most 50 characters long"),
    ),
  ),
  description: v.optional(
    v.pipe(
      v.string("description should be a string"),
      v.minLength(1, "description should be at least 1 character long"),
      v.maxLength(500, "description should be at most 500 characters long"),
    ),
  ),
  price: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number("price should be a number"),
      v.minValue(0, "price should be at least 0"),
    ),
  ),
  addedPhotos: v.optional(
    v.union([
      v.pipe(v.array(fileSchema), v.maxLength(5, "Only allow up to 5 images")),
      v.pipe(
        fileSchema,
        v.transform((file) => [file]),
      ),
    ]),
    [],
  ),
  removedPhotoUrls: v.optional(
    v.union([
      v.pipe(
        v.array(v.string("removed_photo_url should be a string")),
        v.maxLength(5, "Only allow up to 5 images"),
      ),
      v.pipe(
        v.string("removed_photo_url should be a string"),
        v.transform((url) => [url]),
      ),
    ]),
    [],
  ),
});

export const takeDownParamSchema = v.object({
  id: v.pipe(v.string("id should be a string"), v.uuid("id should be a UUID")),
});

export const searchQuerySchema = v.object({
  q: v.pipe(
    v.string("q should be a string"),
    v.minLength(1, "q should be at least 1 character long"),
    v.maxLength(100, "q should be at most 100 characters long"),
  ),
  limit: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.integer("limit should be an integer"),
      v.minValue(1, "limit should be at least 1"),
      v.maxValue(100, "limit should be at most 100"),
    ),
    10,
  ),
  cursor: v.optional(
    v.pipe(
      v.string("cursor should be a string"),
      v.regex(/^[0-9a-f]{24}$/, "cursor is invalid"),
    ),
  ),
  threshold: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number("threshold should be a number"),
      v.minValue(0, "threshold should be at least 0"),
    ),
  ),
});
