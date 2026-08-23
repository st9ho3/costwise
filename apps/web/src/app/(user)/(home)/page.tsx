import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import { RecipeService } from "@costwise/domain/services/recipeService";
import { IngredientService } from "@costwise/domain/services/ingredientService";
import { SupplierService } from "@costwise/domain/services/suppliersService";
import TodayView from "@/app/components/home/TodayView";

const HomePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId = session.user.id;
  const recipeService = new RecipeService(userId);
  const ingredientService = new IngredientService(userId);
  const supplierService = new SupplierService(userId);

  const [
    recipeAnalytics,
    ingredientAnalytics,
    supplierData,
    recipesData,
  ] = await Promise.all([
    recipeService.getRecipesAnalytics(userId),
    ingredientService.getIngredientAnalytics(userId),
    supplierService.findAll(userId, {
      itemsPerPage: 1,
      offset: 0,
      page: 1,
      order: "desc",
      sort: "dateAdded",
    }),
    recipeService.findAll(userId, {
      itemsPerPage: 4,
      offset: 0,
      page: 1,
      order: "desc",
      sort: "dateCreated",
    }),
  ]);

  const totalRecipes = recipeAnalytics ? recipeAnalytics.totalRecipes : 0;
  const avgFoodCost =
    recipeAnalytics && recipeAnalytics.avgFoodCost !== null
      ? Number(recipeAnalytics.avgFoodCost)
      : 0;
  const avgProfitMargin =
    recipeAnalytics && recipeAnalytics.avgProfitMargin !== null
      ? Number(recipeAnalytics.avgProfitMargin)
      : 0;
  const totalIngredients = ingredientAnalytics
    ? ingredientAnalytics.totalIngredients
    : 0;
  const totalSuppliers = supplierData ? supplierData.count.count : 0;

  const firstName = session.user.name?.split(' ')[0] || 'there';

  const recentRecipes = (recipesData?.recipes || []).map((r) => ({
    id: r.id,
    title: r.title,
    sellingPrice: r.sellingPrice,
    profitMargin: r.profitMargin,
    totalCost: r.totalCost,
    category: r.category,
  }));

  return (
    <TodayView
      firstName={firstName}
      totalRecipes={totalRecipes}
      totalIngredients={totalIngredients}
      totalSuppliers={totalSuppliers}
      avgFoodCost={avgFoodCost}
      avgProfitMargin={avgProfitMargin}
      recentRecipes={recentRecipes}
    />
  );
};

export default HomePage;
