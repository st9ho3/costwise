import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

const run = async () => {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");

    // 1. user table: new columns + emailVerified type flip + name backfill
    await c.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`);
    await c.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`);
    const evType = await c.query(`SELECT data_type FROM information_schema.columns WHERE table_name='user' AND column_name='emailVerified'`);
    if (evType.rows[0]?.data_type !== "boolean") {
      await c.query(`ALTER TABLE "user" ADD COLUMN "emailVerified_b" boolean NOT NULL DEFAULT false`);
      await c.query(`UPDATE "user" SET "emailVerified_b" = ("emailVerified" IS NOT NULL)`);
      await c.query(`ALTER TABLE "user" DROP COLUMN "emailVerified"`);
      await c.query(`ALTER TABLE "user" RENAME COLUMN "emailVerified_b" TO "emailVerified"`);
    }
    await c.query(`UPDATE "user" SET name = split_part(email, '@', 1) WHERE name IS NULL`);
    await c.query(`ALTER TABLE "user" ALTER COLUMN name SET NOT NULL`);
    await c.query(`ALTER TABLE "user" ALTER COLUMN email SET NOT NULL`);

    // 2. park old account table; drop dead tables
    await c.query(`ALTER TABLE IF EXISTS "account" RENAME TO "account_old"`);
    await c.query(`DROP TABLE IF EXISTS "session"`);
    await c.query(`DROP TABLE IF EXISTS "verificationToken"`);
    await c.query(`DROP TABLE IF EXISTS "authenticator"`);

    // 3. new tables (Better Auth shape — mirror schema.ts exactly)
    await c.query(`CREATE TABLE IF NOT EXISTS "account" (
      id text PRIMARY KEY, "accountId" text NOT NULL, "providerId" text NOT NULL,
      "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "accessToken" text, "refreshToken" text, "idToken" text,
      "accessTokenExpiresAt" timestamp, "refreshTokenExpiresAt" timestamp,
      scope text, password text,
      "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now())`);
    await c.query(`CREATE TABLE IF NOT EXISTS "session" (
      id text PRIMARY KEY, token text NOT NULL UNIQUE,
      "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "expiresAt" timestamp NOT NULL, "ipAddress" text, "userAgent" text,
      "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now())`);
    await c.query(`CREATE TABLE IF NOT EXISTS "verification" (
      id text PRIMARY KEY, identifier text NOT NULL, value text NOT NULL,
      "expiresAt" timestamp NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now())`);

    // 4. data: google links + credential rows
    const gOld = await c.query(`SELECT count(*) FROM "account_old" WHERE provider = 'google'`).catch(() => ({ rows: [{ count: "0" }] }));
    await c.query(`INSERT INTO "account" (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", scope)
      SELECT gen_random_uuid()::text, "providerAccountId", provider, "userId", access_token, refresh_token, id_token, scope
      FROM "account_old" WHERE provider = 'google'
      ON CONFLICT DO NOTHING`);
    const gNew = await c.query(`SELECT count(*) FROM "account" WHERE "providerId" = 'google'`);

    const pwUsers = await c.query(`SELECT count(*) FROM "user" WHERE password IS NOT NULL`);
    await c.query(`INSERT INTO "account" (id, "accountId", "providerId", "userId", password)
      SELECT gen_random_uuid()::text, id, 'credential', id, password FROM "user"
      WHERE password IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM "account" a WHERE a."userId" = "user".id AND a."providerId" = 'credential')`);
    const credNew = await c.query(`SELECT count(*) FROM "account" WHERE "providerId" = 'credential'`);

    console.log(`google: old=${gOld.rows[0].count} new=${gNew.rows[0].count}`);
    console.log(`credential: users-with-password=${pwUsers.rows[0].count} rows=${credNew.rows[0].count}`);
    if (gOld.rows[0].count !== gNew.rows[0].count) throw new Error("google account count mismatch");
    if (pwUsers.rows[0].count !== credNew.rows[0].count) throw new Error("credential count mismatch");

    // 5. only now: drop parked table and the user.password column
    await c.query(`DROP TABLE IF EXISTS "account_old"`);
    await c.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "password"`);

    await c.query("COMMIT");
    console.log("migration complete");
  } catch (e) {
    await c.query("ROLLBACK");
    console.error("ROLLED BACK:", e);
    process.exit(1);
  } finally {
    c.release();
    await pool.end();
  }
};
run();
