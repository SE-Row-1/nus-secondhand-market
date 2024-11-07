import * as transactionsRepository from "@/transactions/repository";
import { transition } from "@/transactions/service";
import * as transitionModule from "@/transactions/transition";
import type { Transaction } from "@/types";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { participant1 } from "../../test-utils/data";

const mockSelectOneById = spyOn(transactionsRepository, "selectOneById");
const mockStrategy = mock();
const mockChooseStrategy = spyOn(
  transitionModule,
  "chooseStategy",
).mockImplementation(() => mockStrategy);

afterEach(() => {
  mockSelectOneById.mockClear();
  mockStrategy.mockClear();
  mockChooseStrategy.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("executes strategy", async () => {
  const id = crypto.randomUUID();
  mockSelectOneById.mockResolvedValueOnce({} as Transaction);

  await transition({ id, user: participant1, action: "complete" });

  expect(mockSelectOneById).toHaveBeenLastCalledWith(id);
  expect(mockChooseStrategy).toHaveBeenLastCalledWith("complete");
  expect(mockStrategy).toHaveBeenLastCalledWith({}, participant1);
});

it("throws HTTPException 404 if transaction is not found", async () => {
  mockSelectOneById.mockResolvedValueOnce(undefined);

  const promise = transition({
    id: crypto.randomUUID(),
    user: participant1,
    action: "complete",
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toHaveProperty("status", 404);
});
