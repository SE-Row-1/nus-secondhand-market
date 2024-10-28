import { createJsonSchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const result = await v.parseAsync(createJsonSchema, {
    itemId: crypto.randomUUID(),
    buyerId: 1,
  });

  expect(result).toEqual({
    itemId: expect.any(String),
    buyerId: 1,
  });
});

it("throws if itemId is not UUID", async () => {
  const fn = async () =>
    await v.parseAsync(createJsonSchema, {
      itemId: "invalid",
      buyerId: 1,
    });

  expect(fn).toThrow();
});

it("throws if buyerId is not an integer", async () => {
  const fn = async () =>
    await v.parseAsync(createJsonSchema, {
      itemId: crypto.randomUUID(),
      buyerId: 1.1,
    });

  expect(fn).toThrow();
});

it("throws if buyerId is less than 1", async () => {
  const fn = async () =>
    await v.parseAsync(createJsonSchema, {
      itemId: crypto.randomUUID(),
      buyerId: 0,
    });

  expect(fn).toThrow();
});
