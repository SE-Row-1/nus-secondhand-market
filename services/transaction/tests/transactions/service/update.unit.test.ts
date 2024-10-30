import * as transactionsRepository from "@/transactions/repository";
import { update } from "@/transactions/service";
import * as strategies from "@/transactions/update-status-strategies";
import type { Transaction } from "@/types";
import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { HTTPException } from "hono/http-exception";
import { participant1 } from "../../test-utils/data";

const mockSelectOneById = spyOn(transactionsRepository, "selectOneById");
const mockStrategy = mock();
const mockChooseStrategy = spyOn(
  strategies,
  "chooseStrategy",
).mockImplementation(() => mockStrategy);

afterEach(() => {
  mockSelectOneById.mockClear();
  mockChooseStrategy.mockClear();
  mockStrategy.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("executes complete strategy", async () => {
  const id = crypto.randomUUID();
  mockSelectOneById.mockResolvedValueOnce({} as Transaction);

  await update({ id, action: "complete", user: participant1 });

  expect(mockSelectOneById).toHaveBeenLastCalledWith(id);
  expect(mockChooseStrategy).toHaveBeenLastCalledWith("complete");
  expect(mockStrategy).toHaveBeenLastCalledWith({}, participant1);
});

it("executes cancel strategy", async () => {
  const id = crypto.randomUUID();
  mockSelectOneById.mockResolvedValueOnce({} as Transaction);

  await update({ id, action: "cancel", user: participant1 });

  expect(mockSelectOneById).toHaveBeenLastCalledWith(id);
  expect(mockChooseStrategy).toHaveBeenLastCalledWith("cancel");
  expect(mockStrategy).toHaveBeenLastCalledWith({}, participant1);
});

it("throws HTTPException 404 if transaction is not found", async () => {
  mockSelectOneById.mockResolvedValueOnce(undefined);

  const promise = update({
    id: crypto.randomUUID(),
    action: "complete",
    user: participant1,
  });

  expect(promise).rejects.toBeInstanceOf(HTTPException);
  expect(promise).rejects.toEqual(expect.objectContaining({ status: 404 }));
});
