import React from "react";
import { PieChart, Utensils } from "lucide-react";
import { CategoryAnalytics } from "@/types/repositories";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface CategoryBreakdownProps {
  categories: CategoryAnalytics[];
  totalRecipes: number;
}

const CATEGORY_META: Record<
  "starter" | "main" | "dessert",
  { label: string; target: string; colorClass: string }
> = {
  starter: {
    label: "Starters & Appetizers",
    target: "≤ 25%",
    colorClass: "bg-blue-500",
  },
  main: {
    label: "Main Courses",
    target: "≤ 32%",
    colorClass: "bg-emerald-500",
  },
  dessert: {
    label: "Desserts & Pastry",
    target: "≤ 20%",
    colorClass: "bg-amber-500",
  },
};

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categories,
  totalRecipes,
}) => {
  const categoryKeys: ("starter" | "main" | "dessert")[] = [
    "starter",
    "main",
    "dessert",
  ];

  // Map into indexed structure
  const catMap = new Map(categories.map((c) => [c.category, c]));

  return (
    <Card className="flex flex-col shadow-soft-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <PieChart className="h-4 w-4 text-primary" />
            <span>Course & Category Split</span>
          </CardTitle>
          <CardDescription>
            Menu distribution and cost benchmark per course
          </CardDescription>
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {totalRecipes} total dishes
        </span>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-3">
        {totalRecipes === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
            <Utensils className="h-6 w-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Add recipes to view category distribution.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categoryKeys.map((key) => {
              const info = CATEGORY_META[key];
              const data = catMap.get(key);
              const count = data ? data.count : 0;
              const avgCost = data && data.avgFoodCost !== null ? Number(data.avgFoodCost) : 0;
              const share = totalRecipes > 0 ? (count / totalRecipes) * 100 : 0;

              return (
                <div key={key} className="space-y-1.5 rounded-md border border-border/40 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        {info.label}
                      </span>
                      <Badge variant="outline" className="text-[9px]">
                        {count} {count === 1 ? "dish" : "dishes"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {avgCost > 0 ? `${avgCost.toFixed(1)}%` : "N/A"}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        avg cost
                      </span>
                    </div>
                  </div>

                  {/* Progress bar visual */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(0, share))}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {share.toFixed(0)}% menu
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
