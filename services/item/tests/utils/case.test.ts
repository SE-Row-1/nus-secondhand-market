import {
  camelToSnake,
  camelToSnakeString,
  snakeToCamel,
  snakeToCamelString,
} from "@/utils/case";
import { describe, expect, it } from "bun:test";

describe("transform snake case to camel case", () => {
  it("`snakeToCamelString` transforms string", () => {
    expect(snakeToCamelString("foo")).toEqual("foo");
    expect(snakeToCamelString("foo_bar")).toEqual("fooBar");
    expect(snakeToCamelString("foo_bar_baz")).toEqual("fooBarBaz");
  });

  it("`snakeToCamel` transforms array or object", () => {
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

describe("transform camel case to snake case", () => {
  it("`camelToSnakeString` transforms string", () => {
    expect(camelToSnakeString("foo")).toEqual("foo");
    expect(camelToSnakeString("fooBar")).toEqual("foo_bar");
    expect(camelToSnakeString("fooBarBaz")).toEqual("foo_bar_baz");
  });

  it("`camelToSnake` transforms array or object", () => {
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
