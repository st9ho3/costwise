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
import { sendError, sendSuccess } from "../../utils/responses";
import { IngredientService } from "@/app/services/ingredientService";
import { Ingredient } from "@/shemas/recipe";
import { auth } from "@/auth";

const service = new IngredientService();

export const PATCH = async (req: NextRequest) => {
  const session = await auth();
  const ingredient: Ingredient = await req.json();

  try {
    if (!session?.user) {
      throw new Error("Can't take an action if not validated");
    }
    const res = await service.update(ingredient);

    if (!res) {
      return sendError("InvalidData, sorry", 404);
    } else {
      return sendSuccess("Ingrediend updated succesfully", res, 201);
    }
  } catch (err) {
    // Log the actual error on the server for debugging
    console.error("Error updating ingredient:", err);

    return sendError("An unexpected error occurred on the server.", 500);
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  const session = await auth();
  try {
    if (!session?.user) {
      throw new Error("Can't take an action if not validated");
    }
    const { id } = await context.params;

    await service.delete(id);

    return sendSuccess("Ingredient succesfully deleted", null, 201);
  } catch (err) {
    return sendError("An error occured on our side", 500);
  }
};
