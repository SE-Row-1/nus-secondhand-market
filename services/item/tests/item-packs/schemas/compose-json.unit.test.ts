import { composeJsonSchema } from "@/item-packs/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "test",
    discount: 0.5,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeTrue();
});

it("fails if name is not given", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    description: "test",
    discount: 0.5,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if name is empty", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "",
    description: "test",
    discount: 0.5,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if name is too long", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "a".repeat(51),
    description: "test",
    discount: 0.5,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if description is not given", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    discount: 0.5,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if description is empty", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "",
    discount: 0.5,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if description is too long", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "a".repeat(501),
    discount: 0.5,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if discount is not a number", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "test",
    discount: "test",
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if discount is negative", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "test",
    discount: -0.01,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if discount is greater than 1", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "test",
    discount: 1.01,
    childrenIds: [crypto.randomUUID(), crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if childrenIds is not given", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "test",
    discount: 0.5,
  });

  expect(success).toBeFalse();
});

it("fails if childrenIds is not an array", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "test",
    discount: 0.5,
    childrenIds: "test",
  });

  expect(success).toBeFalse();
});

it("fails if childrenIds is too short", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "test",
    discount: 0.5,
    childrenIds: [crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});

it("fails if childrenIds contains an invalid id", async () => {
  const { success } = await v.safeParseAsync(composeJsonSchema, {
    name: "test",
    description: "test",
    discount: 0.5,
    childrenIds: ["test", crypto.randomUUID()],
  });

  expect(success).toBeFalse();
});
