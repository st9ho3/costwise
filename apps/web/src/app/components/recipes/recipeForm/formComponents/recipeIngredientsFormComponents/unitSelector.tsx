import React, { memo } from 'react';
import { Scale } from 'lucide-react';
import { Unit } from '@/shemas/recipe';

import { Select } from '@/app/components/ui/select';

interface UnitSelectorProps {
  unit: Unit;
  availableUnits: Unit[];
  selectedIngredient: string;
  onUnitChange: (value: Unit) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
}

const UnitSelector = memo(({
  unit,
  availableUnits,
  selectedIngredient,
  onUnitChange,
}: UnitSelectorProps) => {
  return (
    <div className="flex items-center p-1 space-x-2 border-l border-dashed border-gray-300 min-w-[120px]">
      <Scale className="size-5 text-stone-400 shrink-0 ml-2" />
      <Select
        placeholder="Unit"
        value={unit}
        disabled={!selectedIngredient}
        onValueChange={(val) => onUnitChange(val as Unit)}
        options={availableUnits.map((u) => ({
          value: u,
          label: u,
        }))}
        size="sm"
      />
    </div>
  );
});

export default UnitSelector

UnitSelector.displayName = "UnitSelector"