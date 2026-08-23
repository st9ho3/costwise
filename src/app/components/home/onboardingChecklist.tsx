import React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Carrot, Truck, Utensils, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

interface OnboardingChecklistProps {
  totalIngredients: number;
  totalSuppliers: number;
  totalRecipes: number;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  totalIngredients,
  totalSuppliers,
  totalRecipes,
}) => {
  const steps = [
    {
      id: 1,
      title: "Add your pantry ingredients",
      description: "Enter raw ingredients with purchase units and costs.",
      href: "/ingredients/create",
      icon: Carrot,
      completed: totalIngredients > 0,
      btnText: totalIngredients > 0 ? "Add more" : "Add ingredients",
    },
    {
      id: 2,
      title: "Connect a vendor / supplier",
      description: "Keep contact details and delivery terms organized.",
      href: "/suppliers/create",
      icon: Truck,
      completed: totalSuppliers > 0,
      btnText: totalSuppliers > 0 ? "Add more" : "Add supplier",
    },
    {
      id: 3,
      title: "Build your first recipe",
      description: "Combine ingredients to calculate true food cost & profit margins.",
      href: "/recipes/create",
      icon: Utensils,
      completed: totalRecipes > 0,
      btnText: totalRecipes > 0 ? "Create recipe" : "Start recipe",
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className="shadow-soft-md border-primary/20 bg-gradient-to-b from-card to-secondary/30">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">Getting Started with CostWise</CardTitle>
          </div>
          <CardDescription>
            Complete these 3 steps to unlock full recipe cost intelligence and margin analysis
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-mono text-xs font-semibold text-foreground">
              {completedCount} of 3 completed
            </span>
          </div>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`flex flex-col justify-between rounded-lg border p-4 transition-all ${
                step.completed
                  ? "border-success/30 bg-success/5"
                  : "border-border/60 bg-card hover:border-primary/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  {step.completed ? (
                    <div className="flex items-center gap-1 font-mono text-[10px] font-medium text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>DONE</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <Circle className="h-3.5 w-3.5" />
                      <span>STEP {step.id}</span>
                    </div>
                  )}
                </div>

                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/30">
                <Button asChild size="sm" variant={step.completed ? "outline" : "default"} className="w-full justify-between text-xs font-mono h-8">
                  <Link href={step.href}>
                    <span>{step.btnText}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
