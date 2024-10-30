import { afterAll, afterEach, expect, it, mock, spyOn } from "bun:test";
import { types } from "pg";

const mockTypes = spyOn(types, "setTypeParser");

afterEach(() => {
  mockTypes.mockClear();
});

afterAll(() => {
  mock.restore();
});

it("sets type parsers", async () => {
  await import("@/utils/db");
  const parser = mockTypes.mock.calls[0]![1] as unknown as (
    value: string,
  ) => number;

  expect(mockTypes).toHaveBeenLastCalledWith(
    types.builtins.NUMERIC,
    expect.any(Function),
  );
  expect(parser("42")).toEqual(42);
});
