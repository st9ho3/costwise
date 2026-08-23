import { IngredientToDisplay, Recipe } from "@/shemas/recipe";
import { ISearchRepository } from "@/types/repositories";
import { ISearchService } from "@/types/services";
import { SearchRepository } from "../repositories/searchRepository";
import {
  transformIngredientFromDB,
  transformRecipeFromDB,
} from "../utils/transformers";

export class SearchService implements ISearchService {
  private searchTerm: string;
  private userId: string;
  private repository: ISearchRepository;

  constructor(searchTerm: string, userId: string) {
    this.searchTerm = searchTerm;
    this.userId = userId;
    this.repository = new SearchRepository(this.searchTerm, this.userId);
  }

  async findRecipe(): Promise<Recipe[] | undefined> {
    const dbRecipes = await this.repository.findRecipe();
    const recipes = dbRecipes?.map((dbrecipe) =>
      transformRecipeFromDB(dbrecipe)
    );

    return recipes;
  }

  async findIngredient(): Promise<IngredientToDisplay[] | undefined> {
    const dbIngredients = await this.repository.findIngredient();
    const ingredients = dbIngredients?.map((dbIngredient) =>
      transformIngredientFromDB(dbIngredient)
    );

    return ingredients;
  }
}
