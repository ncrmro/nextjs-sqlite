import { Kysely, SqliteDialect } from "kysely";
import { default as SQLiteDatabase } from "better-sqlite3";
import { Tables } from "@/lib/tables";

// Keys of this interface are table names.
export interface Database {
  migrations: Tables.Migration;
  users: Tables.User;
}

export const sqlite = new SQLiteDatabase("sqlite3.db");
sqlite.pragma("journal_mode = WAL");
sqlite.function("regexp", { deterministic: true }, (regex, text) =>
  new RegExp(regex as string).test(text as string) ? 1 : 0
);

// You'd create one of these when you start your app.
export const db = new Kysely<Database>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new SqliteDialect({
    database: sqlite,
  }),
});

export { sql } from "kysely";
