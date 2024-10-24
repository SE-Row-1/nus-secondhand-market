import { ItemStatus, ItemType } from "@/types";
import * as v from "valibot";

export const getAllQuerySchema = v.object({
  type: v.optional(v.enum(ItemType, "Invalid item type")),
  status: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.enum(ItemStatus, "Invalid item status"),
    ),
  ),
  sellerId: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.integer("Seller ID should be an integer"),
      v.minValue(1, "Invalid Seller ID"),
    ),
  ),
  limit: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.integer("Limit should be an integer"),
      v.minValue(1, "Limit should be at least 1"),
      v.maxValue(100, "Limit should be at most 100"),
    ),
    8,
  ),
  cursor: v.optional(
    v.pipe(
      v.string("Cursor should be a string"),
      v.regex(/^[0-9a-f]{24}$/, "Invalid cursor"),
    ),
  ),
});

export const getOneParamSchema = v.object({
  id: v.pipe(v.string("ID should be a string"), v.uuid("ID should be a UUID")),
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
    v.string("Name should be a string"),
    v.minLength(1, "Name should be at least 1 character long"),
    v.maxLength(50, "Name should be at most 50 characters long"),
  ),
  description: v.pipe(
    v.string("Description should be a string"),
    v.minLength(1, "Description should be at least 1 character long"),
    v.maxLength(500, "Description should be at most 500 characters long"),
  ),
  price: v.pipe(
    v.unknown(),
    v.transform(Number),
    v.number("Price should be a number"),
    v.minValue(0, "Price should be at least 0"),
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
  id: v.pipe(v.string("ID should be a string"), v.uuid("ID should be a UUID")),
});

export const updateFormSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string("Name should be a string"),
      v.minLength(1, "Name should be at least 1 character long"),
      v.maxLength(50, "Name should be at most 50 characters long"),
    ),
  ),
  description: v.optional(
    v.pipe(
      v.string("Description should be a string"),
      v.minLength(1, "Description should be at least 1 character long"),
      v.maxLength(500, "Description should be at most 500 characters long"),
    ),
  ),
  price: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number("Price should be a number"),
      v.minValue(0, "Price should be at least 0"),
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
        v.array(v.string("Photo URL should be a string")),
        v.maxLength(5, "Only allow up to 5 photo URLs"),
      ),
      v.pipe(
        v.string("Photo URL should be a string"),
        v.transform((url) => [url]),
      ),
    ]),
    [],
  ),
});

export const updateStatusParamSchema = v.object({
  id: v.pipe(v.string("ID should be a string"), v.uuid("ID should be a UUID")),
});

export const updateStatusJsonSchema = v.object({
  status: v.pipe(
    v.unknown(),
    v.transform(Number),
    v.enum(ItemStatus, "Invalid item status"),
  ),
  buyer: v.optional(
    v.object({
      id: v.pipe(
        v.unknown(),
        v.transform(Number),
        v.integer("Buyer ID should be an integer"),
        v.minValue(1, "Invalid buyer ID"),
      ),
      nickname: v.string("Name should be a string"),
      avatarUrl: v.pipe(
        v.string("Avatar URL should be a string"),
        v.url("Avatar URL should be a valid URL"),
      ),
    }),
  ),
});

export const takeDownParamSchema = v.object({
  id: v.pipe(v.string("ID should be a string"), v.uuid("ID should be a UUID")),
});

export const searchQuerySchema = v.object({
  q: v.pipe(
    v.string("Q should be a string"),
    v.minLength(1, "Q should be at least 1 character long"),
    v.maxLength(100, "Q should be at most 100 characters long"),
  ),
  limit: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.integer("Limit should be an integer"),
      v.minValue(1, "Limit should be at least 1"),
      v.maxValue(100, "Limit should be at most 100"),
    ),
    8,
  ),
  cursor: v.optional(
    v.pipe(
      v.string("Cursor should be a string"),
      v.regex(/^[0-9a-f]{24}$/, "Invalid cursor"),
    ),
  ),
  threshold: v.optional(
    v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number("Threshold should be a number"),
      v.minValue(0, "Threshold should be at least 0"),
    ),
  ),
});
