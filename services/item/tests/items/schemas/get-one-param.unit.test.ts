import { getOneParamSchema } from "@/items/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const { success } = await v.safeParseAsync(getOneParamSchema, {
    id: crypto.randomUUID(),
  });

  expect(success).toBeTrue();
});

it("fails if id is not given", async () => {
  const { success } = await v.safeParseAsync(getOneParamSchema, {});

  expect(success).toBeFalse();
});

it("fails if id is not a UUID", async () => {
  const { success } = await v.safeParseAsync(getOneParamSchema, {
    id: "test",
  });

  expect(success).toBeFalse();
});
