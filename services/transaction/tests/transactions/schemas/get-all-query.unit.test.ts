import { getAllQuerySchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if no field is given", async () => {
  const { success, output } = await v.safeParseAsync(getAllQuerySchema, {});

  expect(success).toBeTrue();
  expect(output).toEqual({});
});

it("passes if itemId is valid", async () => {
  const itemId = crypto.randomUUID();

  const { success, output } = await v.safeParseAsync(getAllQuerySchema, {
    itemId,
  });

  expect(success).toBeTrue();
  expect(output).toEqual({ itemId });
});

it("fails if itemId is not UUID", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    itemId: "invalid",
  });

  expect(success).toBeFalse();
});

it("passes if isCancelled is true", async () => {
  const { success, output } = await v.safeParseAsync(getAllQuerySchema, {
    isCancelled: "true",
  });

  expect(success).toBeTrue();
  expect(output).toEqual({ isCancelled: true });
});

it("passes if isCancelled is false", async () => {
  const { success, output } = await v.safeParseAsync(getAllQuerySchema, {
    isCancelled: "false",
  });

  expect(success).toBeTrue();
  expect(output).toEqual({ isCancelled: false });
});

it("passes if isCancelled is anything else", async () => {
  const { success, output } = await v.safeParseAsync(getAllQuerySchema, {
    isCancelled: "anything",
  });

  expect(success).toBeTrue();
  expect(output).toEqual({ isCancelled: undefined });
});
