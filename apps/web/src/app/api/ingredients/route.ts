/**
 * API route for creating a new ingredient.
 * This route handles POST requests, expecting the new ingredient's data in the request body.
 * It uses the `IngredientService` to perform the creation operation.
 * Upon a successful creation, it returns a success response with the new ingredient's data and a 201 status code.
 * If the request data is invalid or an error occurs during the process, it returns an appropriate error response.
 */
import { NextRequest } from "next/server";
import { sendSuccess } from "../utils/responses";
import { IngredientService } from "@costwise/domain/services/ingredientService";
import { Ingredient } from "@costwise/shared/recipe";
import { auth } from "@/auth";
import { errorHandler } from "@/app/utils/errorHandler";
import { AuthenticationError } from "@costwise/domain/utils/errors";

export const POST = async (req: NextRequest) => {
  const session = await auth();

  try {
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }
    const ingredient: Ingredient = await req.json();
    const service = new IngredientService(session.user.id);

    const response = await service.create(ingredient);

    return sendSuccess("Ingredient successfully created", response, 201);
  } catch (err) {
    return errorHandler(err);
  }
};
