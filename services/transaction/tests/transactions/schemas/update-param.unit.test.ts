import { updateParamSchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if id is valid", async () => {
  const result = await v.parseAsync(updateParamSchema, {
    id: crypto.randomUUID(),
  });

  expect(result).toEqual({
    id: expect.any(String),
  });
});

it("throws if id is not UUID", async () => {
  const fn = async () =>
    await v.parseAsync(updateParamSchema, {
      id: "invalid",
    });

  expect(fn).toThrow();
});
