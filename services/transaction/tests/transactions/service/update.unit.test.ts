import { update } from "@/transactions/service";
import { afterAll, beforeAll, expect, it, mock } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { participant1 } from "../../test-utils/data";

const mockSelectOneById = mock();
const mockPublishEvent = mock();
const mockStrategy = mock();

beforeAll(() => {
  mock.module("@/transactions/repository", () => ({
    selectOneById: mockSelectOneById,
  }));

  mock.module("@/transactions/update-status-strategies", () => ({
    chooseStrategy: () => mockStrategy,
  }));

  mock.module("@/events/publish", () => ({
    publishEvent: mockPublishEvent,
  }));
});

afterAll(() => {
  mock.restore();
});

it("executes a strategy", async () => {
  mockSelectOneById.mockResolvedValueOnce({});

  await update({
    id: crypto.randomUUID(),
    action: "complete",
    user: participant1,
  });

  expect(mockStrategy).toHaveBeenLastCalledWith({}, participant1);
});

it("throws HTTPException 404 if transaction is not found", async () => {
  mockSelectOneById.mockResolvedValueOnce(undefined);

  const fn = async () =>
    await update({
      id: crypto.randomUUID(),
      action: "complete",
      user: participant1,
    });

  expect(fn).toThrow(HTTPException);
  expect(fn).toThrow(expect.objectContaining({ status: 404 }));
});
