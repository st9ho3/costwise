/**
 * Handles the user registration process by creating a new account.
 * This API route expects a POST request with user credentials in the body.
 * It uses the `AuthService` to attempt to create a new user account.
 * If the account is successfully created, it returns a success response with the new user data.
 * If the data is invalid or an error occurs during the process, it returns an appropriate error response.
 */
import { AuthService } from "@/app/services/authservice";
import { NextRequest } from "next/server";
import { sendSuccess } from "../../utils/responses";
import { errorHandler } from "@/app/utils/errorHandler";

export const POST = async (req: NextRequest) => {
  const service = new AuthService();

  const credentials = await req.json();

  try {
    const res = await service.create(credentials);

    return sendSuccess("Account created successfully!", res);
  } catch (err) {
    return errorHandler(err);
  }
};
