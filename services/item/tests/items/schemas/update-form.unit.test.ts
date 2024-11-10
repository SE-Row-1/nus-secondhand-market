import { updateFormSchema } from "@/items/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if no field is given", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {});

  expect(success).toBeTrue();
});

it("passes if name is valid", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    name: "name",
  });

  expect(success).toBeTrue();
});

it("fails if name is empty", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    name: "",
  });

  expect(success).toBeFalse();
});

it("fails if name is too long", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    name: "a".repeat(51),
  });

  expect(success).toBeFalse();
});

it("passes if description is valid", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    description: "description",
  });

  expect(success).toBeTrue();
});

it("fails if description is empty", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    description: "",
  });

  expect(success).toBeFalse();
});

it("fails if description is too long", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    description: "a".repeat(501),
  });

  expect(success).toBeFalse();
});

it("passes if price is valid", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    price: 1,
  });

  expect(success).toBeTrue();
});

it("fails if price is not a number", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    price: "test",
  });

  expect(success).toBeFalse();
});

it("fails if price is negative", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    price: -1,
  });

  expect(success).toBeFalse();
});

it("passes if addedPhotos is valid", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    addedPhotos: [new File(["test"], "file1.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeTrue();
});

it("passes if addedPhotos is empty", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    addedPhotos: [],
  });

  expect(success).toBeTrue();
});

it("passes if addedPhotos is a single file", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    addedPhotos: new File(["test"], "file1.jpg", { type: "image/jpeg" }),
  });

  expect(success).toBeTrue();
});

it("fails if addedPhotos is too long", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    addedPhotos: new Array(6).fill(null),
  });

  expect(success).toBeFalse();
});

it("fails if addedPhotos is not a file", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    addedPhotos: "test",
  });

  expect(success).toBeFalse();
});

it("fails if addedPhotos is not an array or a file", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    addedPhotos: 1,
  });

  expect(success).toBeFalse();
});

it("passes if removedPhotoUrls is valid", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    removedPhotoUrls: ["test.jpg"],
  });

  expect(success).toBeTrue();
});

it("passes if removedPhotoUrls is empty", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    removedPhotoUrls: [],
  });

  expect(success).toBeTrue();
});

it("passes if removedPhotoUrls is a single string", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    removedPhotoUrls: "test.jpg",
  });

  expect(success).toBeTrue();
});

it("fails if removedPhotoUrls is too long", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    removedPhotoUrls: new Array(6).fill("test.jpg"),
  });

  expect(success).toBeFalse();
});

it("fails if removedPhotoUrls is not a string", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    removedPhotoUrls: [1],
  });

  expect(success).toBeFalse();
});

it("fails if removedPhotoUrls is not an array or a string", async () => {
  const { success } = await v.safeParseAsync(updateFormSchema, {
    removedPhotoUrls: 1,
  });

  expect(success).toBeFalse();
});
