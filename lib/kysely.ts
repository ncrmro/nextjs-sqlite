import { Kysely, SqliteDialect, Transaction as KTransaction } from "kysely";
import { default as SQLiteDatabase } from "better-sqlite3";
import { Database } from "@/lib/tables";
import * as crypto from "crypto";

export const sqlite = new SQLiteDatabase("sqlite3.db");
sqlite.pragma("journal_mode = WAL");
sqlite.function("regexp", { deterministic: true }, (regex, text) =>
  new RegExp(regex as string).test(text as string) ? 1 : 0
);
sqlite.function("uuid", () => crypto.randomUUID());
sqlite.function("slugify", { deterministic: true }, (text) => {
  if (typeof text !== "string") throw new Error("Argument was not a string");
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
});

// You'd create one of these when you start your app.
export const db = new Kysely<Database>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new SqliteDialect({
    database: sqlite,
  }),
});

export { sql } from "kysely";
