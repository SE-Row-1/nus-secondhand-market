import { createJsonSchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const itemId = crypto.randomUUID();

  const { success, output } = await v.safeParseAsync(createJsonSchema, {
    itemId,
    buyerId: 1,
  });

  expect(success).toBeTrue();
  expect(output).toEqual({ itemId, buyerId: 1 });
});

it("fails if itemId is not given", async () => {
  const { success } = await v.safeParseAsync(createJsonSchema, { buyerId: 1 });

  expect(success).toBeFalse();
});

it("fails if itemId is not UUID", async () => {
  const { success } = await v.safeParseAsync(createJsonSchema, {
    itemId: "invalid",
    buyerId: 1,
  });

  expect(success).toBeFalse();
});

it("fails if buyerId is not given", async () => {
  const { success } = await v.safeParseAsync(createJsonSchema, {
    itemId: crypto.randomUUID(),
  });

  expect(success).toBeFalse();
});

it("fails if buyerId is not an integer", async () => {
  const { success } = await v.safeParseAsync(createJsonSchema, {
    itemId: crypto.randomUUID(),
    buyerId: 1.1,
  });

  expect(success).toBeFalse();
});

it("fails if buyerId is less than 1", async () => {
  const { success } = await v.safeParseAsync(createJsonSchema, {
    itemId: crypto.randomUUID(),
    buyerId: 0,
  });

  expect(success).toBeFalse();
});
