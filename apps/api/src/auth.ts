import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import bcrypt from "bcrypt";
import { db } from "@costwise/db/db";
import { users, sessions, accounts, verifications } from "@costwise/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
  basePath: "/v1/auth",
  secret: process.env.BETTER_AUTH_SECRET ?? "test-secret-32-chars-minimum-xxxx",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password) => bcrypt.hash(password, 10),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID ?? "test-google-id",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "test-google-secret",
    },
  },
  trustedOrigins: [process.env.WEB_ORIGIN ?? "http://localhost:3000"],
});
