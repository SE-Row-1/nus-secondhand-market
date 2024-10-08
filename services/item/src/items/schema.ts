import { ItemStatus, ItemType } from "@/types";
import * as v from "valibot";

export const getAllItemsQuerySchema = v.object({
  type: v.optional(v.enum(ItemType)),
  status: v.optional(
    v.pipe(v.unknown(), v.transform(Number), v.enum(ItemStatus)),
  ),
  sellerId: v.optional(
    v.pipe(v.unknown(), v.transform(Number), v.integer(), v.minValue(1)),
  ),
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
});

const fileSchema = v.pipe(
  v.file(),
  v.mimeType(["image/jpeg", "image/png", "image/webp", "image/avif"]),
  v.maxSize(5 * 1024 * 1024),
);

export const publishItemFormSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(50)),
  description: v.pipe(v.string(), v.minLength(1), v.maxLength(500)),
  price: v.pipe(v.unknown(), v.transform(Number), v.minValue(0)),
  photos: v.optional(
    v.union([
      v.pipe(v.array(fileSchema), v.maxLength(5)),
      v.pipe(
        fileSchema,
        v.transform((file) => [file]),
      ),
    ]),
    [],
  ),
});

export const takeDownItemParamSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
});

export const searchItemQuerySchema = v.object({
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
