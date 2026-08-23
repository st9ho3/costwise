/**
 * AuthService - Business logic layer for user authentication and registration
 *
 * This service class handles user authentication workflows including email/password registration,
 * email lookup, and Google OAuth user creation. It coordinates between the AuthRepository
 * and external utilities (like bcrypt for password hashing) to implement secure authentication
 * business rules and validation logic.
 *
 * Features:
 * - User registration with password confirmation validation
 * - Email uniqueness enforcement
 * - Secure password hashing using bcrypt
 * - Google OAuth user creation
 * - Input validation using Zod schemas
 */
import {
  SignUpCredentials,
  signUpCredentialsSchema,
  User,
} from "@costwise/shared/auth";
import { AUTHService } from "../types/auth";
import { AuthRepository } from "../repositories/authRepository";
import bcrypt from "bcrypt";
import { ConflictError, ValidationError } from "../utils/errors";

export class AuthService implements AUTHService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const user = this.authRepository.findUserByEmail(email);

    return user;
  }

  async create(credentials: SignUpCredentials): Promise<string | undefined> {
    if (credentials.password !== credentials.passwordConfirmation) {
      throw new ValidationError([
        { field: "password", message: "Passwords don't match" },
      ]);
    }

    const result = signUpCredentialsSchema.safeParse(credentials);

    if (result.success) {
      const userExists = await this.authRepository.findUserByEmail(
        result.data.email
      );

      if (userExists) {
        throw new ConflictError("User", "email");
      }

      const hashedPassword = await bcrypt.hash(result.data?.password, 10);

      const user = await this.authRepository.create(
        result.data.email,
        hashedPassword
      );

      return user;
    } else {
      throw new ValidationError(result.error);
    }
  }

  async createGoogleUser(user: User): Promise<string | undefined> {
    const userId = await this.authRepository.createGoogleUser(user);

    return userId;
  }

  async updateUserImage(userId: string, image: string, name?: string | null): Promise<void> {
    await this.authRepository.updateUserImage(userId, image, name);
  }
}
