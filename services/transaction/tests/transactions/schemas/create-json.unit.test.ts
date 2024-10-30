import { createJsonSchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const itemId = crypto.randomUUID();

  const result = await v.parseAsync(createJsonSchema, { itemId, buyerId: 1 });

  expect(result).toEqual({ itemId, buyerId: 1 });
});

it("throws ValiError if itemId is not given", async () => {
  const promise = v.parseAsync(createJsonSchema, { buyerId: 1 });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if itemId is not UUID", async () => {
  const promise = v.parseAsync(createJsonSchema, {
    itemId: "invalid",
    buyerId: 1,
  });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if buyerId is not given", async () => {
  const promise = v.parseAsync(createJsonSchema, {
    itemId: crypto.randomUUID(),
  });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if buyerId is not an integer", async () => {
  const promise = v.parseAsync(createJsonSchema, {
    itemId: crypto.randomUUID(),
    buyerId: 1.1,
  });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if buyerId is less than 1", async () => {
  const promise = v.parseAsync(createJsonSchema, {
    itemId: crypto.randomUUID(),
    buyerId: 0,
  });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});
