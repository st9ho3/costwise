import React from "react";
import Link from "next/link";
import { AlertCircle, Award, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Recipe } from "@costwise/shared/recipe";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface MarginAlertsProps {
  topPerformers: Recipe[];
  attentionNeeded: Recipe[];
}

export const MarginAlerts: React.FC<MarginAlertsProps> = ({
  topPerformers,
  attentionNeeded,
}) => {
  // Filter attention-needed recipes to those with foodCost >= 32 or profitMargin < 60
  const urgentRecipes = attentionNeeded.filter((r) => {
    const cost = Number(r.foodCost || 0);
    const margin = Number(r.profitMargin || 0);
    return cost >= 32 || margin < 60;
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 1. Margin Watchlist */}
      <Card className="flex flex-col shadow-soft-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span>Margin Watchlist</span>
            </CardTitle>
            <CardDescription>
              Recipes with high food cost (≥ 32%) or low margins
            </CardDescription>
          </div>
          <Badge variant={urgentRecipes.length > 0 ? "destructive" : "secondary"}>
            {urgentRecipes.length} flagged
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 space-y-2.5 pt-3">
          {urgentRecipes.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <CheckCircle2 className="h-7 w-7 text-success" />
              <p className="text-sm font-medium text-foreground">
                All margins healthy
              </p>
              <p className="text-xs text-muted-foreground">
                No recipes currently exceed the 32% food cost threshold.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {urgentRecipes.map((recipe) => {
                const foodCost = Number(recipe.foodCost || 0);
                const profitMargin = Number(recipe.profitMargin || 0);
                return (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="group flex items-center justify-between py-2.5 transition-colors hover:bg-accent/50 rounded-md px-2 -mx-2"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground group-hover:underline">
                          {recipe.title}
                        </span>
                        <Badge variant="outline" className="text-[9px] capitalize">
                          {recipe.category}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                        <span>Cost: €{Number(recipe.totalCost || 0).toFixed(2)}</span>
                        <span>•</span>
                        <span>Price: €{Number(recipe.sellingPrice || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-right">
                      <div>
                        <div className="font-mono text-xs font-bold text-destructive">
                          {foodCost.toFixed(1)}% cost
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          {profitMargin.toFixed(1)}% margin
                        </div>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Top Margin Champions */}
      <Card className="flex flex-col shadow-soft-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-success" />
              <span>Margin Champions</span>
            </CardTitle>
            <CardDescription>
              Top performing recipes by profit margin
            </CardDescription>
          </div>
          <Badge variant="success">
            Top Earners
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 space-y-2.5 pt-3">
          {topPerformers.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
              <Award className="h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No recipes recorded yet
              </p>
              <p className="text-xs text-muted-foreground">
                Create recipes to uncover your most profitable dishes.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {topPerformers.map((recipe) => {
                const profitMargin = Number(recipe.profitMargin || 0);
                const foodCost = Number(recipe.foodCost || 0);
                return (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="group flex items-center justify-between py-2.5 transition-colors hover:bg-accent/50 rounded-md px-2 -mx-2"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground group-hover:underline">
                          {recipe.title}
                        </span>
                        <Badge variant="outline" className="text-[9px] capitalize">
                          {recipe.category}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                        <span>Cost: €{Number(recipe.totalCost || 0).toFixed(2)}</span>
                        <span>•</span>
                        <span>Price: €{Number(recipe.sellingPrice || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 text-right">
                      <div>
                        <div className="font-mono text-xs font-bold text-success">
                          {profitMargin.toFixed(1)}% margin
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground">
                          {foodCost.toFixed(1)}% cost
                        </div>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
