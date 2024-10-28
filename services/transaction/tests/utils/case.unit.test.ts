import {
  camelToSnake,
  camelToSnakeString,
  snakeToCamel,
  snakeToCamelString,
} from "@/utils/case";
import { expect, it } from "bun:test";

it("snakeToCamelString", () => {
  expect(snakeToCamelString("foo")).toEqual("foo");
  expect(snakeToCamelString("foo_bar")).toEqual("fooBar");
  expect(snakeToCamelString("foo_bar_baz")).toEqual("fooBarBaz");
});

it("snakeToCamel", () => {
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

it("camelToSnakeString", () => {
  expect(camelToSnakeString("foo")).toEqual("foo");
  expect(camelToSnakeString("fooBar")).toEqual("foo_bar");
  expect(camelToSnakeString("fooBarBaz")).toEqual("foo_bar_baz");
});

it("camelToSnake", () => {
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
