import { Pool, types } from "pg";

export const db = new Pool({
  host: Bun.env.PGHOST,
  port: parseInt(Bun.env.PGPORT, 10),
  user: Bun.env.PGUSER,
  password: Bun.env.PGPASSWORD,
  database: Bun.env.PGDATABASE,
});

types.setTypeParser(types.builtins.NUMERIC, (value) => parseInt(value, 10));
