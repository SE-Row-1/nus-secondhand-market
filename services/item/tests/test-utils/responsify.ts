import { camelToSnake } from "@/utils/case";

export function responsify(obj: unknown) {
  return camelToSnake(JSON.parse(JSON.stringify(obj)));
}
