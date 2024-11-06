import { transitionParamSchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const id = crypto.randomUUID();

  const result = await v.parseAsync(transitionParamSchema, {
    id,
    action: "complete",
  });

  expect(result).toEqual({ id, action: "complete" });
});

it("throws ValiError if id is not given", async () => {
  const promise = v.parseAsync(transitionParamSchema, {});

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if id is not UUID", async () => {
  const promise = v.parseAsync(transitionParamSchema, { id: "invalid" });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if action is not given", async () => {
  const promise = v.parseAsync(transitionParamSchema, {
    id: crypto.randomUUID(),
  });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});

it("throws ValiError if action is not valid", async () => {
  const promise = v.parseAsync(transitionParamSchema, {
    id: crypto.randomUUID(),
    action: "invalid",
  });

  expect(promise).rejects.toBeInstanceOf(v.ValiError);
});
