import { publishFormSchema } from "@/items/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const { success, issues } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    price: 10,
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  console.log(issues);

  expect(success).toBeTrue();
});

it("fails if name is not given", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    description: "test",
    price: 10,
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("fails if name is empty", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "",
    description: "test",
    price: 10,
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("fails if name is too long", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "a".repeat(51),
    description: "test",
    price: 10,
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("fails if description is not given", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    price: 10,
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("fails if description is empty", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "",
    price: 10,
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("fails if description is too long", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "a".repeat(501),
    price: 10,
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("fails if price is not given", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("fails if price is not a number", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    price: "test",
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("fails if price is negative", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    price: -1,
    photos: [new File(["test"], "test.jpg", { type: "image/jpeg" })],
  });

  expect(success).toBeFalse();
});

it("passes if photos is not given", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    price: 10,
  });

  expect(success).toBeTrue();
});

it("passes if photos is one single photo", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    price: 10,
    photos: new File(["test"], "test.jpg", { type: "image/jpeg" }),
  });

  expect(success).toBeTrue();
});

it("fails if photos is too long", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    price: 10,
    photos: [
      new File(["test"], "test.jpg", { type: "image/jpeg" }),
      new File(["test"], "test.jpg", { type: "image/jpeg" }),
      new File(["test"], "test.jpg", { type: "image/jpeg" }),
      new File(["test"], "test.jpg", { type: "image/jpeg" }),
      new File(["test"], "test.jpg", { type: "image/jpeg" }),
      new File(["test"], "test.jpg", { type: "image/jpeg" }),
    ],
  });

  expect(success).toBeFalse();
});

it("fails if photo has an unsupported format", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    price: 10,
    photos: [new File(["test"], "test.gif", { type: "image/gif" })],
  });

  expect(success).toBeFalse();
});

it("fails if photo is too large", async () => {
  const { success } = await v.safeParseAsync(publishFormSchema, {
    name: "test",
    description: "test",
    price: 10,
    photos: [
      new File(["test".repeat(6 * 1024 * 1024)], "test.jpg", {
        type: "image/jpeg",
      }),
    ],
  });

  expect(success).toBeFalse();
});
