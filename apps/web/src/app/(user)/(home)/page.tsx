import { getServerSession } from "@/app/lib/serverSession";
import { redirect } from "next/navigation";
import React from "react";
import TodayView from "@/app/components/home/TodayView";
import { apiServer } from "@/app/lib/apiServer";

const HomePage = async () => {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const api = await apiServer();

  const [
    recipeAnalyticsRes,
    ingredientAnalyticsRes,
    supplierDataRes,
    recipesDataRes,
  ] = await Promise.all([
    api.GET("/v1/analytics/recipes"),
    api.GET("/v1/analytics/ingredients"),
    api.GET("/v1/suppliers", {
      params: {
        query: {
          itemsPerPage: 1,
          offset: 0,
          page: 1,
          order: "desc",
          sort: "dateAdded",
        },
      },
    }),
    api.GET("/v1/recipes", {
      params: {
        query: {
          itemsPerPage: 4,
          offset: 0,
          page: 1,
          order: "desc",
          sort: "dateCreated",
        },
      },
    }),
  ]);

  const recipeAnalytics = recipeAnalyticsRes.data;
  const ingredientAnalytics = ingredientAnalyticsRes.data;
  const supplierData = supplierDataRes.data;
  const recipesData = recipesDataRes.data;

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
