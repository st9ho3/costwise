/**
 * API route for handling PATCH and DELETE requests for a single ingredient.
 * This route uses `IngredientService` to perform operations on an ingredient resource.
 *
 * The `PATCH` handler updates an existing ingredient. It expects the updated ingredient data in the request body.
 * It returns a success response with the updated ingredient if the update is successful,
 * or an error response if the data is invalid or an unexpected error occurs.
 *
 * The `DELETE` handler removes an ingredient by its ID. It extracts the ID from the URL parameters
 * and calls the `delete` method of the `IngredientService`. It returns a success response upon
 * successful deletion or an error response if the deletion fails.
 * Error logging is included for debugging purposes.
 */
import { NextRequest } from "next/server";
import { sendSuccess } from "../../utils/responses";
import { IngredientService } from "@costwise/domain/services/ingredientService";
import { Ingredient } from "@costwise/shared/recipe";
import { getServerSession } from "@/app/lib/serverSession";
import { AuthenticationError } from "@costwise/domain/utils/errors";
import { errorHandler } from "@/app/utils/errorHandler";

export const PATCH = async (req: NextRequest) => {
  const session = await getServerSession();

  try {
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }
    const service = new IngredientService(session.user.id);
    const ingredient: Ingredient = await req.json();

    const res = await service.update(ingredient);

    return sendSuccess("Ingrediend updated succesfully", res, 201);
  } catch (err) {
    return errorHandler(err);
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const session = await getServerSession();
  try {
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }
    const service = new IngredientService(session.user.id);
    const { id } = await context.params;

    await service.delete(id);

    return sendSuccess("Ingredient succesfully deleted", null, 201);
  } catch (err) {
    return errorHandler(err);
  }
};
