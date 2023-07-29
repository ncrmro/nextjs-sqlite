import { Kysely, SqliteDialect } from "kysely";
import { default as SQLiteDatabase } from "better-sqlite3";
import { DB } from "kysely-codegen";
import * as crypto from "crypto";
/*
  slugify needs to be a relative import here
 */
import { slugify } from "./utils";

export const sqlite = new SQLiteDatabase(
  process.env.DATABASE_PATH ?? "database/sqlite3.db"
);
sqlite.pragma("journal_mode = WAL");
sqlite.function("regexp", { deterministic: true }, (regex, text) =>
  new RegExp(regex as string).test(text as string) ? 1 : 0
);
sqlite.function("uuid", () => crypto.randomUUID());
sqlite.function("slugify", { deterministic: true }, (text) => {
  if (typeof text !== "string") throw new Error("Argument was not a string");
  return slugify(text);
});

// You'd create one of these when you start your app.
export const db = new Kysely<DB>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new SqliteDialect({
    database: sqlite,
  }),
});

export { sql } from "kysely";
