import { db } from "@/db/db";
import { ingredientsTable, recipesTable } from "@/db/schema";
import { DBIngredient, DBRecipe } from "@/shemas/recipe";
import { ISearchRepository } from "@/types/repositories";
import { and, eq, ilike } from "drizzle-orm";
import { DatabaseError } from "../utils/errors";

export class SearchRepository implements ISearchRepository {
  private searchTerm: string;
  private userId: string;

  constructor(searchTerm: string, userId: string) {
    this.searchTerm = searchTerm;
    this.userId = userId;
  }

  async findRecipe(): Promise<DBRecipe[] | undefined> {
    try {
      const recipes = await db
        .select()
        .from(recipesTable)
        .where(
          and(
            eq(recipesTable.userId, this.userId),
            ilike(recipesTable.title, `%${this.searchTerm}%`)
          )
        );

      return recipes;
    } catch (error) {
      throw new DatabaseError("Search Recipe", error);
    }
  }

  async findIngredient(): Promise<DBIngredient[] | undefined> {
    try {
      const ingredients = await db
        .select()
        .from(ingredientsTable)
        .where(
          and(
            eq(ingredientsTable.userId, this.userId),
            ilike(ingredientsTable.name, `%${this.searchTerm}%`)
          )
        );

      return ingredients as DBIngredient[];
    } catch (error) {
      throw new DatabaseError("Search Ingredient", error);
    }
  }
}
