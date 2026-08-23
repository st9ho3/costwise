import React from "react";
import Link from "next/link";
import { Percent, TrendingUp, Utensils, Carrot, Truck, ArrowUpRight } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface KpiStripProps {
  totalRecipes: number;
  totalIngredients: number;
  totalSuppliers: number;
  avgFoodCost: number;
  avgProfitMargin: number;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  totalRecipes,
  totalIngredients,
  totalSuppliers,
  avgFoodCost,
  avgProfitMargin,
}) => {
  // Food cost status badge
  let foodCostVariant: "success" | "secondary" | "destructive" = "success";
  let foodCostLabel = "Healthy (<28%)";
  if (avgFoodCost > 35) {
    foodCostVariant = "destructive";
    foodCostLabel = "Critical (>35%)";
  } else if (avgFoodCost >= 28) {
    foodCostVariant = "secondary";
    foodCostLabel = "Attention (28-35%)";
  }

  // Profit margin status badge
  let marginVariant: "success" | "secondary" | "destructive" = "success";
  let marginLabel = "Optimal (>65%)";
  if (avgProfitMargin < 50) {
    marginVariant = "destructive";
    marginLabel = "Low (<50%)";
  } else if (avgProfitMargin < 65) {
    marginVariant = "secondary";
    marginLabel = "Moderate (50-65%)";
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Avg Food Cost */}
      <Card className="flex flex-col justify-between p-4 transition-all hover:border-foreground/30 shadow-soft-sm">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Avg Food Cost
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-foreground">
              <Percent className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {avgFoodCost > 0 ? `${avgFoodCost.toFixed(1)}%` : "0.0%"}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
          <Badge variant={foodCostVariant} className="text-[9px]">
            {foodCostLabel}
          </Badge>
          <span className="font-mono text-[10px] text-muted-foreground">
            Target ≤ 30%
          </span>
        </div>
      </Card>

      {/* 2. Avg Profit Margin */}
      <Card className="flex flex-col justify-between p-4 transition-all hover:border-foreground/30 shadow-soft-sm">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              Avg Profit Margin
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {avgProfitMargin > 0 ? `${avgProfitMargin.toFixed(1)}%` : "0.0%"}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2">
          <Badge variant={marginVariant} className="text-[9px]">
            {marginLabel}
          </Badge>
          <span className="font-mono text-[10px] text-muted-foreground">
            Target ≥ 65%
          </span>
        </div>
      </Card>

      {/* 3. Recipes */}
      <Link href="/recipes" className="group block">
        <Card className="flex h-full flex-col justify-between p-4 transition-all group-hover:border-foreground/30 shadow-soft-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Active Recipes
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-foreground">
                <Utensils className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {totalRecipes}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[10px] text-muted-foreground group-hover:text-foreground">
            <span>Manage recipes</span>
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Card>
      </Link>

      {/* 4. Ingredients */}
      <Link href="/ingredients" className="group block">
        <Card className="flex h-full flex-col justify-between p-4 transition-all group-hover:border-foreground/30 shadow-soft-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Ingredients
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-foreground">
                <Carrot className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {totalIngredients}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[10px] text-muted-foreground group-hover:text-foreground">
            <span>Pantry catalog</span>
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Card>
      </Link>

      {/* 5. Suppliers */}
      <Link href="/suppliers" className="group block sm:col-span-2 lg:col-span-1">
        <Card className="flex h-full flex-col justify-between p-4 transition-all group-hover:border-foreground/30 shadow-soft-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Suppliers
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-foreground">
                <Truck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {totalSuppliers}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[10px] text-muted-foreground group-hover:text-foreground">
            <span>Vendor list</span>
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </Card>
      </Link>
    </div>
  );
};
