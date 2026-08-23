import React from "react";
import Link from "next/link";
import { Carrot, Truck, Utensils } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface DashboardHeaderProps {
  userName?: string | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-5">
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Overview
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Kitchen Dashboard
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
          {userName ? `Welcome back, ${userName}` : "Kitchen Overview"}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-mono">
          <Link href="/ingredients/create">
            <Carrot className="h-3.5 w-3.5" />
            <span>+ Ingredient</span>
          </Link>
        </Button>

        <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-mono">
          <Link href="/suppliers/create">
            <Truck className="h-3.5 w-3.5" />
            <span>+ Supplier</span>
          </Link>
        </Button>

        <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-mono">
          <Link href="/recipes/create">
            <Utensils className="h-3.5 w-3.5" />
            <span>+ New Recipe</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
