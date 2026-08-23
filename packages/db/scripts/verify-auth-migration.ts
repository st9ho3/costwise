// Read-only post-migration verification (Task 3 checkpoint).
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

const run = async () => {
  const cols = await pool.query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='user' ORDER BY column_name`
  );
  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('account','session','verification','account_old','verificationToken','authenticator') ORDER BY table_name`
  );
  const cred = await pool.query(
    `SELECT count(*) FROM "account" WHERE "providerId"='credential' AND password IS NOT NULL`
  );
  const users = await pool.query(`SELECT count(*) FROM "user" WHERE name IS NULL`);
  console.log("user columns:", cols.rows.map((r) => `${r.column_name}:${r.data_type}`).join(", "));
  console.log("auth tables present:", tables.rows.map((r) => r.table_name).join(", "));
  console.log("credential rows with hash:", cred.rows[0].count);
  console.log("users with null name:", users.rows[0].count);
  await pool.end();
};

run().catch((e) => { console.error("VERIFY FAILED:", e.message); process.exit(1); });
