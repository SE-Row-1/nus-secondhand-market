import { decomposeParamSchema } from "@/item-packs/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if id is valid", async () => {
  const { success } = await v.safeParseAsync(decomposeParamSchema, {
    id: crypto.randomUUID(),
  });

  expect(success).toBeTrue();
});

it("fails if id is not given", async () => {
  const { success } = await v.safeParseAsync(decomposeParamSchema, {});

  expect(success).toBeFalse();
});

it("fails if id is not a UUID", async () => {
  const { success } = await v.safeParseAsync(decomposeParamSchema, {
    id: "test",
  });

  expect(success).toBeFalse();
});
