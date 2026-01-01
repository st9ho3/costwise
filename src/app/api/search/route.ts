import { SearchService } from "@/app/services/searchService";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { sendSuccess } from "../utils/responses";
import { AuthenticationError, ValidationError } from "../../utils/errors";
import { errorHandler } from "../../utils/errorHandler";

export const GET = async (req: NextRequest) => {
  const session = await auth();

  const request = req.nextUrl;
  const searchTerm = request.searchParams.get("q");

  try {
    if (!session?.user?.id) {
      throw new AuthenticationError();
    }

    if (!searchTerm) {
      throw new ValidationError([
        { field: "search", message: "Please enter a value" },
      ]);
    }

    const service = new SearchService(searchTerm, session.user.id);

    const ingredients = await service.findIngredient();
    const recipes = await service.findRecipe();

    const searcResults = { ingredients: ingredients, recipes: recipes };

    return sendSuccess("Your data: ", searcResults);
  } catch (error) {
    return errorHandler(error);
  }
};
