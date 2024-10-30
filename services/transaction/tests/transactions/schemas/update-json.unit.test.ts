import { updateJsonSchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if action is complete", async () => {
  const result = await v.parseAsync(updateJsonSchema, { action: "complete" });

  expect(result).toEqual({ action: "complete" });
});

it("passes if action is cancel", async () => {
  const result = await v.parseAsync(updateJsonSchema, { action: "cancel" });

  expect(result).toEqual({ action: "cancel" });
});

it("throws ValiError if action is not given", async () => {
  const promise = v.parseAsync(updateJsonSchema, {});

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if action is invalid", async () => {
  const promise = v.parseAsync(updateJsonSchema, { action: "invalid" });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});
