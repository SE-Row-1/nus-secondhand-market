import { getAllQuerySchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if given nothing", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {});

  expect(result).toEqual({ excludeCancelled: false });
});

it("passes if itemId is valid", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {
    itemId: "10f33906-24df-449d-b4fb-fcc6c76606b6",
  });

  expect(result).toEqual({
    itemId: "10f33906-24df-449d-b4fb-fcc6c76606b6",
    excludeCancelled: false,
  });
});

it("throws if itemId is not UUID", async () => {
  const fn = async () =>
    await v.parseAsync(getAllQuerySchema, {
      itemId: "invalid",
    });

  expect(fn).toThrow();
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

it("passes if excludeCancelled is any string", async () => {
  const result = await v.parseAsync(getAllQuerySchema, {
    excludeCancelled: "anything",
  });

  expect(result).toEqual({ excludeCancelled: false });
});
