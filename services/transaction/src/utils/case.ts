export type SnakeToCamelString<S extends string> =
  S extends `${infer A}_${infer B}${infer C}`
    ? `${Lowercase<A>}${Uppercase<B>}${SnakeToCamelString<C>}`
    : Lowercase<S>;

export function snakeToCamelString<S extends string>(
  string: S,
): SnakeToCamelString<S> {
  return string.replace(/(_\w)/g, (substring) =>
    substring[1]!.toUpperCase(),
  ) as SnakeToCamelString<S>;
}

export type CamelToSnakeString<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? `${First extends Uppercase<First> ? `_${Lowercase<First>}` : First}${CamelToSnakeString<Rest>}`
    : S;

export function camelToSnakeString<S extends string>(
  string: S,
): CamelToSnakeString<S> {
  return string.replace(
    /[A-Z]/g,
    (substring) => `_${substring.toLowerCase()}`,
  ) as CamelToSnakeString<S>;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export type SnakeToCamel<Json> = Json extends (infer Element)[]
  ? SnakeToCamel<Element>[]
  : Json extends Record<string, unknown>
    ? {
        [Key in keyof Json as SnakeToCamelString<Key & string>]: SnakeToCamel<
          Json[Key]
        >;
      }
    : Json;

export function snakeToCamel<Json>(json: Json): SnakeToCamel<Json> {
  if (Array.isArray(json)) {
    return json.map((item) => snakeToCamel(item)) as SnakeToCamel<Json>;
  }

  if (isObject(json)) {
    return Object.entries(json).reduce(
      (acc, [key, value]) => {
        acc[snakeToCamelString(key)] = snakeToCamel(value);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as SnakeToCamel<Json>;
  }

  return json as SnakeToCamel<Json>;
}

export type CamelToSnake<Json> = Json extends (infer Element)[]
  ? CamelToSnake<Element>[]
  : Json extends Record<string, unknown>
    ? {
        [Key in keyof Json as CamelToSnakeString<Key & string>]: CamelToSnake<
          Json[Key]
        >;
      }
    : Json;

export function camelToSnake<Json>(json: Json): CamelToSnake<Json> {
  if (Array.isArray(json)) {
    return json.map((item) => camelToSnake(item)) as CamelToSnake<Json>;
  }

  if (isObject(json)) {
    return Object.entries(json).reduce(
      (acc, [key, value]) => {
        acc[camelToSnakeString(key)] = camelToSnake(value);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as CamelToSnake<Json>;
  }

  return json as CamelToSnake<Json>;
}
