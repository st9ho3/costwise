import React from "react";
import Link from "next/link";
import { Layers, ArrowUpRight, Carrot } from "lucide-react";
import { HighImpactIngredient } from "@costwise/domain/types/repositories";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface HighImpactIngredientsProps {
  ingredients: HighImpactIngredient[];
}

export const HighImpactIngredients: React.FC<HighImpactIngredientsProps> = ({
  ingredients,
}) => {
  return (
    <Card className="flex flex-col shadow-soft-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="h-4 w-4 text-primary" />
            <span>High-Impact Ingredients</span>
          </CardTitle>
          <CardDescription>
            Most utilized ingredients across your recipe catalog
          </CardDescription>
        </div>
        <Link
          href="/ingredients"
          className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <span>All ingredients</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-2.5 pt-3">
        {ingredients.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-center">
            <Carrot className="h-6 w-6 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Add ingredients and link them to recipes to track high-impact items.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {ingredients.map((item) => (
              <Link
                key={item.id}
                href={`/ingredients/${item.id}`}
                className="group flex items-center justify-between py-2.5 transition-colors hover:bg-accent/50 rounded-md px-2 -mx-2"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-foreground group-hover:underline">
                      {item.name}
                    </span>
                    <Badge variant="outline" className="text-[9px]">
                      {item.category || "General"}
                    </Badge>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 text-right">
                  <div className="font-mono text-xs font-semibold text-foreground">
                    {item.usage} {item.usage === 1 ? "recipe" : "recipes"}
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
