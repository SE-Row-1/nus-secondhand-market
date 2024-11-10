import { getAllQuerySchema } from "@/items/schemas";
import { ItemStatus, ItemType } from "@/types";
import { expect, it } from "bun:test";
import { ObjectId } from "mongodb";
import * as v from "valibot";

it("passes if all fields are valid", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    type: ItemType.Single,
    status: ItemStatus.ForSale,
    sellerId: 1,
    limit: 10,
    cursor: new ObjectId().toString(),
  });

  expect(success).toBeTrue();
});

it("passes if no field is not given", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {});

  expect(success).toBeTrue();
});

it("fails if type is invalid", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    type: "test",
  });

  expect(success).toBeFalse();
});

it("fails if status is invalid", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    status: "test",
  });

  expect(success).toBeFalse();
});

it("fails if sellerId is not an integer", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    sellerId: "test",
  });

  expect(success).toBeFalse();
});

it("fails if sellerId is less than 1", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    sellerId: 0,
  });

  expect(success).toBeFalse();
});

it("fails if limit is not an integer", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    limit: "test",
  });

  expect(success).toBeFalse();
});

it("fails if limit is less than 1", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    limit: 0,
  });

  expect(success).toBeFalse();
});

it("fails if limit is more than 100", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    limit: 101,
  });

  expect(success).toBeFalse();
});

it("fails if cursor is not a string", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    cursor: 1,
  });

  expect(success).toBeFalse();
});

it("fails if cursor is invalid", async () => {
  const { success } = await v.safeParseAsync(getAllQuerySchema, {
    cursor: "test",
  });

  expect(success).toBeFalse();
});
