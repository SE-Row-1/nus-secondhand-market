export type SnakeToCamelString<Raw extends string> =
  Raw extends `${infer A}_${infer B}${infer C}`
    ? `${Lowercase<A>}${Uppercase<B>}${SnakeToCamelString<C>}`
    : Lowercase<Raw>;

/**
 * Transform a string from snake case to camel case.
 */
export function snakeToCamelString<Raw extends string>(
  raw: Raw,
): SnakeToCamelString<Raw> {
  return raw.replace(/(_\w)/g, (m) =>
    m[1]!.toUpperCase(),
  ) as SnakeToCamelString<Raw>;
}

export type CamelToSnakeString<Raw extends string> =
  Raw extends `${infer First}${infer Rest}`
    ? `${First extends Uppercase<First> ? `_${Lowercase<First>}` : First}${CamelToSnakeString<Rest>}`
    : Raw;

/**
 * Transform a string from camel case to snake case.
 */
export function camelToSnakeString<Raw extends string>(
  raw: Raw,
): CamelToSnakeString<Raw> {
  return raw.replace(
    /[A-Z]/g,
    (m) => `_${m.toLowerCase()}`,
  ) as CamelToSnakeString<Raw>;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export type SnakeToCamel<Obj> = Obj extends (infer Item)[]
  ? SnakeToCamel<Item>[]
  : Obj extends Record<string, unknown>
    ? {
        [Key in keyof Obj as SnakeToCamelString<Key & string>]: SnakeToCamel<
          Obj[Key]
        >;
      }
    : Obj;

/**
 * Transform an array or object from snake case to camel case.
 */
export function snakeToCamel<Obj>(obj: Obj): SnakeToCamel<Obj> {
  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item)) as SnakeToCamel<Obj>;
  }

  if (isObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        snakeToCamelString(key),
        snakeToCamel(value),
      ]),
    ) as SnakeToCamel<Obj>;
  }

  return obj as SnakeToCamel<Obj>;
}

export type CamelToSnake<Obj> = Obj extends (infer Item)[]
  ? CamelToSnake<Item>[]
  : Obj extends Record<string, unknown>
    ? {
        [Key in keyof Obj as CamelToSnakeString<Key & string>]: CamelToSnake<
          Obj[Key]
        >;
      }
    : Obj;

/**
 * Transform an array or object from camel case to snake case.
 */
export function camelToSnake<Obj>(obj: Obj): CamelToSnake<Obj> {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item)) as CamelToSnake<Obj>;
  }

  if (isObject(obj)) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        camelToSnakeString(key),
        camelToSnake(value),
      ]),
    ) as CamelToSnake<Obj>;
  }

  return obj as CamelToSnake<Obj>;
}
