/**
 * AuthRepository - Data access layer for user authentication management
 *
 * This repository class provides user authentication-related database operations including
 * user lookup, registration, and Google OAuth integration. It implements the AUTHrepository
 * interface and handles all database interactions for user authentication workflows.
 *
 * Features:
 * - User lookup by email address
 * - Standard user registration with email/password
 * - Google OAuth user creation and management
 */

import { db } from "@costwise/db/db";
import { users } from "@costwise/db/schema";
import { User } from "@costwise/shared/auth";
import { AUTHrepository } from "../types/auth";
import { eq } from "drizzle-orm";
import { DatabaseError } from "../utils/errors";

export class AuthRepository implements AUTHrepository {
  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        return undefined;
      }

      return user as unknown as User;
    } catch (err) {
      console.error("Failed to find user by email:", err);
      throw new DatabaseError("AuthRepository.findUserByEmail", err);
    }
  }

  async create(email: string, password: string): Promise<string | undefined> {
    try {
      const [userId] = await db
        .insert(users)
        .values({
          name: email.split("@")[0],
          email: email,
        } as any)
        .returning({
          user: users.id,
        });

      return userId.user;
    } catch (err) {
      console.error("Failed to create user:", err);
      throw new DatabaseError("AuthRepository.create", err);
    }
  }

  async createGoogleUser(user: User): Promise<string | undefined> {
    try {
      const [userId] = await db.insert(users).values(user as any).returning({
        id: users.id,
      });

      return userId.id;
    } catch (err) {
      console.error("Failed to create Google user:", err);
      throw new DatabaseError("AuthRepository.createGoogleUser", err);
    }
  }

  async updateUserImage(userId: string, image: string, name?: string | null): Promise<void> {
    try {
      const updateData: { image: string; name?: string } = { image };
      if (name) {
        updateData.name = name;
      }
      await db.update(users).set(updateData).where(eq(users.id, userId));
    } catch (err) {
      console.error("Failed to update user image:", err);
      throw new DatabaseError("AuthRepository.updateUserImage", err);
    }
  }
}
