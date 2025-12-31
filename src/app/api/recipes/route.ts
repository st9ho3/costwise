/**
 * API route for creating a new recipe.
 * This route handles POST requests, expecting the new recipe's data in the request body.
 * It utilizes the `RecipeService` to handle the creation logic.
 * Upon a successful creation, it returns a success response with a 201 status code.
 * If the provided data is invalid or an error occurs during the process, it returns an appropriate error response with a 404 or 500 status code.
 */
import { NextRequest } from "next/server";
import { sendSuccess } from "../utils/responses";
import { RecipeService } from "@/app/services/recipeService";
import { auth } from "@/auth";
import { errorHandler } from "@/app/utils/errorHandler";
import { AuthenticationError } from "@/app/utils/errors";

export const POST = async (req: NextRequest) => {
  const session = await auth();

  try {
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }
    const service = new RecipeService(session.user.id);
    const request = await req.json();

    await service.create(request);

    return sendSuccess("Recipe successfully created!", null, 201);
  } catch (err) {
    return errorHandler(err);
  }
};
