import { transitionParamSchema } from "@/transactions/schemas";
import { expect, it } from "bun:test";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const id = crypto.randomUUID();

  const { success, output } = await v.safeParseAsync(transitionParamSchema, {
    id,
    action: "complete",
  });

  expect(success).toBeTrue();
  expect(output).toEqual({ id, action: "complete" });
});

it("fails if id is not given", async () => {
  const { success } = await v.safeParseAsync(transitionParamSchema, {
    action: "complete",
  });

  expect(success).toBeFalse();
});

it("fails if id is not UUID", async () => {
  const { success } = await v.safeParseAsync(transitionParamSchema, {
    id: "invalid",
    action: "complete",
  });

  expect(success).toBeFalse();
});

it("fails if action is not given", async () => {
  const { success } = await v.safeParseAsync(transitionParamSchema, {
    id: crypto.randomUUID(),
  });

  expect(success).toBeFalse();
});

it("fails if action is not valid", async () => {
  const { success } = await v.safeParseAsync(transitionParamSchema, {
    id: crypto.randomUUID(),
    action: "invalid",
  });

  expect(success).toBeFalse();
});
