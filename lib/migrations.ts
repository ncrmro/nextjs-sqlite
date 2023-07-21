import { db, sqlite } from "./kysely";
import fs from "fs/promises";
import * as crypto from "crypto";

const migrationsTable = `
    CREATE TABLE IF NOT EXISTS migrations
    (
        id         integer                             NOT NULL PRIMARY KEY,
        filename   text                                NOT NULL UNIQUE,
        sha        text                                NOT NULL UNIQUE,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    CREATE TRIGGER IF NOT EXISTS migrations_insert_timestamp_trigger
        AFTER INSERT
        ON migrations
    BEGIN
        UPDATE migrations
        SET created_at = CURRENT_TIMESTAMP
        WHERE id = new.id;
    END;

    CREATE TRIGGER IF NOT EXISTS migrations_update_timestamp_trigger
        AFTER UPDATE
        ON migrations
    BEGIN
        UPDATE migrations
        SET created_at = old.created_at AND updated_at = CURRENT_TIMESTAMP
        WHERE id = new.id;
    END;
`;

function sha256(content: string) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function log(message: TemplateStringsArray, ...values: any[]) {
  console.info(`MIG: ${message}`);
}

let uptoDate = true;

async function runMigrations() {
  sqlite.exec(migrationsTable);
  const [committedMigrations, migrationFilenames] = await Promise.all([
    // @ts-ignore
    db.selectFrom("migrations").select(["id", "filename", "sha"]).execute(),
    fs.readdir("migrations"),
  ]);
  const migrations = new Map(
    committedMigrations.map((row) => [row.filename, row])
  );

  for (const migrationFilename of migrationFilenames.sort()) {
    const migration = await fs.readFile(
      `migrations/${migrationFilename}`,
      "utf8"
    );
    const sha = sha256(migration);
    const committedSHA = migrations.get(migrationFilename)?.sha;

    // Check committed migration and filesystem migration's contents match.
    if (committedSHA && committedSHA !== sha) {
      throw new Error(
        `Existing migration ${migrationFilename} SHA doesn't match SHA from filesystem migration`
      );
    } else if (!committedSHA) {
      uptoDate = false;
      log`Running migration ${migrationFilename}`;
      const query = `
        BEGIN TRANSACTION;
        ${migration}
        INSERT INTO migrations (filename, sha)
        VALUES ('${migrationFilename}', '${sha}');
        END TRANSACTION;
      `;
      sqlite.exec(query);
    }
  }
}

async function seed() {
  log`Running seeds`;
  const seeds = await fs.readdir("seeds");
  for (const filename of seeds.sort()) {
    const seed = await fs.readFile(`seeds/${filename}`, "utf8");
    sqlite.exec(seed);
  }
}

async function main() {
  await runMigrations();
  uptoDate ? log`Already up to date` : log`Finished migrations`;
  await seed();
}

main().then(() => {});
