import "./loadEnv";
import { sql } from "drizzle-orm";
import { db } from "../src/db";

// Additive-only: restores the canonical price columns on `ingredients`
// (spec: docs/superpowers/specs/2026-08-23-ingredient-price-read-model-design.md).
// Idempotent via IF NOT EXISTS; never drops or rewrites anything.
const run = async () => {
  await db.execute(sql`
    ALTER TABLE "ingredients"
      ADD COLUMN IF NOT EXISTS "unit" "unit" NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS "unit_price" numeric(10, 5) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "quantity" numeric NOT NULL DEFAULT 1;
  `);

  const cols = await db.execute(sql`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'ingredients'
    ORDER BY ordinal_position;
  `);
  console.log("ingredients columns now:");
  for (const row of cols.rows) {
    console.log(`  ${row.column_name}  ${row.data_type}  default=${row.column_default}`);
  }
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
