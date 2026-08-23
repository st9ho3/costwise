// Read-only preflight for the Better Auth migration (Task 3 checkpoint).
// SELECT-only: verifies the assumptions migrate-auth.ts relies on.
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

const run = async () => {
  const host = new URL(process.env.DATABASE_URL!).host;
  const v = await pool.query("SHOW server_version");
  const users = await pool.query(`SELECT count(*) FROM "user"`);
  const pw = await pool.query(`SELECT count(*) FROM "user" WHERE password IS NOT NULL`);
  const nullName = await pool.query(`SELECT count(*) FROM "user" WHERE name IS NULL`);
  const google = await pool
    .query(`SELECT count(*) FROM "account" WHERE provider = 'google'`)
    .then((r) => r.rows[0].count)
    .catch((e) => `ERR: ${e.message}`);
  const uuid = await pool
    .query("SELECT gen_random_uuid()")
    .then(() => "available")
    .catch((e) => `MISSING: ${e.message}`);
  const evType = await pool.query(
    `SELECT data_type FROM information_schema.columns WHERE table_name='user' AND column_name='emailVerified'`
  );

  console.log("db host:", host);
  console.log("postgres:", v.rows[0].server_version);
  console.log("users:", users.rows[0].count, "| with password:", pw.rows[0].count, "| null name:", nullName.rows[0].count);
  console.log("google accounts:", google);
  console.log("emailVerified type:", evType.rows[0]?.data_type ?? "column missing");
  console.log("gen_random_uuid:", uuid);
  await pool.end();
};

run().catch((e) => {
  console.error("PREFLIGHT FAILED:", e.message);
  process.exit(1);
});
