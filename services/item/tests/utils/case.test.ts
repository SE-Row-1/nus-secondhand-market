import { camelToSnake, snakeToCamel } from "@/utils/case";
import { describe, expect, it } from "bun:test";

describe("snakeToCamel transforms snake case to camel case", () => {
  it("transforms object key at any level deep", () => {
    expect(
      snakeToCamel({
        foo_foo_foo: [
          {
            bar_bar: {
              baz: "test_value",
            },
          },
        ],
        qux_qux: "test_value",
      }),
    ).toEqual({
      fooFooFoo: [
        {
          barBar: {
            baz: "test_value",
          },
        },
      ],
      quxQux: "test_value",
    });
  });
});

describe("camelToSnake transforms camel case to snake case", () => {
  it("transforms object key at any level deep", () => {
    expect(
      camelToSnake({
        fooFooFoo: [
          {
            barBar: {
              baz: "testValue",
            },
          },
        ],
        quxQux: "testValue",
      }),
    ).toEqual({
      foo_foo_foo: [
        {
          bar_bar: {
            baz: "testValue",
          },
        },
      ],
      qux_qux: "testValue",
    });
  });
});
