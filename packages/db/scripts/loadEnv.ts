import { config } from "dotenv";
import { fileURLToPath } from "node:url";

// Load the repo-root .env regardless of the cwd these scripts run from
// (pnpm --filter runs them with cwd=packages/db, where no .env exists).
config({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set — expected it in <repo root>/.env",
  );
}
