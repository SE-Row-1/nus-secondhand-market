import {
  camelToSnake,
  camelToSnakeString,
  snakeToCamel,
  snakeToCamelString,
} from "@/utils/case";
import { describe, expect, it } from "bun:test";

describe("snakeToCamelString", () => {
  it("transforms string from snake_case to camelCase", () => {
    expect(snakeToCamelString("foo")).toEqual("foo");
    expect(snakeToCamelString("foo_bar")).toEqual("fooBar");
    expect(snakeToCamelString("foo_bar_baz")).toEqual("fooBarBaz");
  });
});

describe("snakeToCamel", () => {
  it("transforms json keys from snake_case to camelCase", () => {
    expect(
      snakeToCamel({
        foo_foo: [
          {
            bar_bar: {
              baz_baz: "test_value",
            },
          },
        ],
      }),
    ).toEqual({
      fooFoo: [
        {
          barBar: {
            bazBaz: "test_value",
          },
        },
      ],
    });
  });
});

describe("camelToSnakeString", () => {
  it("transforms string from camelCase to snake_case", () => {
    expect(camelToSnakeString("foo")).toEqual("foo");
    expect(camelToSnakeString("fooBar")).toEqual("foo_bar");
    expect(camelToSnakeString("fooBarBaz")).toEqual("foo_bar_baz");
  });
});

describe("camelToSnake", () => {
  it("transforms json keys from camelCase to snake_case", () => {
    expect(
      camelToSnake({
        fooFoo: [
          {
            barBar: {
              bazBaz: "test_value",
            },
          },
        ],
      }),
    ).toEqual({
      foo_foo: [
        {
          bar_bar: {
            baz_baz: "test_value",
          },
        },
      ],
    });
  });
});
