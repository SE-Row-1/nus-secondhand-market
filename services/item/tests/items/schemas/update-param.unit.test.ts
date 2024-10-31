import { updateParamSchema } from "@/items/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if id is valid", async () => {
  const { success } = await v.safeParseAsync(updateParamSchema, {
    id: crypto.randomUUID(),
  });

  expect(success).toBeTrue();
});

it("fails if id is not given", async () => {
  const { success } = await v.safeParseAsync(updateParamSchema, {});

  expect(success).toBeFalse();
});

it("fails if id is not a UUID", async () => {
  const { success } = await v.safeParseAsync(updateParamSchema, {
    id: "not-a-uuid",
  });

  expect(success).toBeFalse();
});
