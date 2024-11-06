import { getAllQuerySchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if itemId is not given", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {});

  expect(result).toEqual({ excludeCancelled: false });
});

it("passes if itemId is valid", async () => {
  const itemId = crypto.randomUUID();

  const result = await v.parseAsync(getAllQuerySchema, { itemId });

  expect(result).toEqual({ itemId, excludeCancelled: false });
});

it("throws ValiError if itemId is not UUID", async () => {
  const promise = v.parseAsync(getAllQuerySchema, { itemId: "invalid" });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("passes if excludeCancelled is not given", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {});

  expect(result).toEqual({ excludeCancelled: false });
});

it("passes if excludeCancelled is true", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {
    excludeCancelled: "true",
  });

  expect(result).toEqual({ excludeCancelled: true });
});

it("passes if excludeCancelled is false", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {
    excludeCancelled: "false",
  });

  expect(result).toEqual({ excludeCancelled: false });
});

it("passes if excludeCancelled is anything", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {
    excludeCancelled: 1,
  });

  expect(result).toEqual({ excludeCancelled: false });
});