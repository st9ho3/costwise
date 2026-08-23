import React, { memo } from 'react';
import { Carrot } from 'lucide-react';
import { Ingredient } from '@/shemas/recipe';

import { Select } from '@/app/components/ui/select';

interface IngredientSelectorProps {
  ingredients: Ingredient[];
  selectedIngredient: string;
  onIngredientChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const IngredientSelector = memo(({
  ingredients,
  selectedIngredient,
  onIngredientChange,
}: IngredientSelectorProps) => {
  return (
    <div className="flex items-center gap-3 w-full">
      <Carrot className="size-5 text-stone-400 shrink-0" />
      <Select
        placeholder="Select ingredient..."
        value={selectedIngredient}
        onValueChange={onIngredientChange}
        options={ingredients.map((ing) => ({
          value: ing.name,
          label: ing.name,
        }))}
      />
    </div>
  );
});

IngredientSelector.displayName = 'IngredientSelector';

export default IngredientSelector