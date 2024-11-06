import { Pool, types } from "pg";

export const db = new Pool();

types.setTypeParser(types.builtins.NUMERIC, (value) => parseInt(value, 10));
