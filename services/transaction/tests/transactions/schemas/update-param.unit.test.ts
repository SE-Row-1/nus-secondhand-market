import { updateParamSchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if id is valid", async () => {
  const id = crypto.randomUUID();

  const result = await v.parseAsync(updateParamSchema, { id });

  expect(result).toEqual({ id });
});

it("throws ValiError if id is not given", async () => {
  const promise = v.parseAsync(updateParamSchema, {});

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if id is not UUID", async () => {
  const promise = v.parseAsync(updateParamSchema, { id: "invalid" });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});
