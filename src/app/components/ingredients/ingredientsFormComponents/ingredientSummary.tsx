// src/components/ingredients/constants/IngredientSummary.tsx

import React from 'react';
import { Calculator } from 'lucide-react';

type IngredientSummaryProps = {
  quantity: number;
  unit: string;
  name: string;
  price: number;
};

const IngredientSummary = ({ quantity, unit, name, price }: IngredientSummaryProps) => {
  
  const totalCost = (quantity * price).toFixed(2);
  const safeName = name || "Item";

  return (
    <div className="
      flex items-start gap-3 w-full 
      p-4 rounded-lg 
      bg-accent border border-border
      text-foreground
    ">
      <div className="mt-0.5 p-1.5 bg-secondary rounded-md text-primary">
        <Calculator size={18} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col w-full">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
          Summary
        </span>
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold">{quantity} {unit}</span> of <span className="font-semibold">{safeName}</span>
        </p>
        <div className="mt-2 pt-2 border-t border-border flex justify-between items-center w-full">
            <span className="text-xs font-medium text-muted-foreground">Estimated Cost</span>
            <span className="text-lg font-bold text-primary font-mono tracking-tight">
                {totalCost}€
            </span>
        </div>
      </div>
    </div>
  );
};

export default IngredientSummary;