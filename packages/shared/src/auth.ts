import { z } from 'zod'

// Zod schema for the User table.
export const userSchema = z.object({
  id: z.string().uuid({ message: "Invalid UUID." }).optional(),
  name: z.string().nullable().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  emailVerified: z.date().nullable().optional(),
  image: z.string().url({ message: "Invalid URL format." }).nullable().optional(),
  password: z.string().nullable().optional(),
});

// Inferred TypeScript type for a user.
export type User = z.infer<typeof userSchema>;

// Zod schema for validating user credentials on sign-in.
export const signInCredentialsSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

// Inferred TypeScript type for credentials.
export type SignInCredentials = z.infer<typeof signInCredentialsSchema>;

// Zod schema for validating user credentials on sign-up.
export const signUpCredentialsSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirmation: z.string({ required_error: "Passwords don't match" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

// Inferred TypeScript type for credentials.
export type SignUpCredentials = z.infer<typeof signUpCredentialsSchema>;