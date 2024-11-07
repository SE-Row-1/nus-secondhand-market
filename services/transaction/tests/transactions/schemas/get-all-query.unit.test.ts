import { getAllQuerySchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if no field is given", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {});

  expect(result).toEqual({});
});

it("passes if itemId is valid", async () => {
  const itemId = crypto.randomUUID();

  const result = await v.parseAsync(getAllQuerySchema, { itemId });

  expect(result).toEqual({ itemId });
});

it("throws ValiError if itemId is not UUID", async () => {
  const promise = v.parseAsync(getAllQuerySchema, { itemId: "invalid" });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("passes if isCancelled is not given", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {});

  expect(result).toEqual({});
});

it("passes if isCancelled is true", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {
    isCancelled: "true",
  });

  expect(result).toEqual({ isCancelled: true });
});

it("passes if isCancelled is false", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {
    isCancelled: "false",
  });

  expect(result).toEqual({ isCancelled: false });
});

it("passes if isCancelled is anything", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {
    isCancelled: 1,
  });

  expect(result).toEqual({ isCancelled: undefined });
});
