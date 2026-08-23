"use client";

import React, { useCallback } from 'react';
import { Plus, Minus } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { IngredientFormFields } from '@/app/hooks/useIngredientsForm';
import { cn } from '@/app/utils/cn';

interface IncrementalProps {
  onIngredientChange?: UseFormSetValue<IngredientFormFields>;
  onRecipeIngredientChange?: (value: number) => void;
  count: number;
  onKeyDown?: (value: React.KeyboardEvent<HTMLInputElement>) => void;
  setErrors?: (value: React.SetStateAction<string[]>) => void;
  className?: string;
  step?: number;
}

const Incremental = ({
  onIngredientChange,
  onRecipeIngredientChange,
  count,
  onKeyDown,
  setErrors,
  className,
  step = 1,
}: IncrementalProps) => {
  const handleStep = useCallback(
    (action: 'minus' | 'plus') => {
      const delta = action === 'plus' ? step : -step;
      const nextValue = Math.max(0, count + delta);

      if (onIngredientChange) {
        onIngredientChange('quantity', nextValue);
        setErrors?.([]);
      }
      if (onRecipeIngredientChange) {
        onRecipeIngredientChange(nextValue);
        setErrors?.([]);
      }
    },
    [count, step, onIngredientChange, onRecipeIngredientChange, setErrors]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
      if (onIngredientChange) {
        onIngredientChange('quantity', val);
        setErrors?.([]);
      }
      if (onRecipeIngredientChange) {
        onRecipeIngredientChange(val);
        setErrors?.([]);
      }
    },
    [onIngredientChange, onRecipeIngredientChange, setErrors]
  );

  return (
    <div
      className={cn(
        "inline-flex items-center justify-between h-[44px] px-2 rounded-[12px] bg-white border border-sand-300 hover:border-sand-400 focus-within:border-green-500 focus-within:ring-3 focus-within:ring-green-500/20 transition-all duration-140 select-none",
        className
      )}
    >
      <button
        type="button"
        onClick={() => handleStep('minus')}
        disabled={count <= 0}
        aria-label="Decrease quantity"
        className="size-[28px] rounded-full bg-cream-200 hover:bg-sand-300 active:scale-95 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shrink-0"
      >
        <Minus className="size-4" strokeWidth={2} />
      </button>

      <input
        type="number"
        min="0"
        value={count === 0 ? '' : count}
        placeholder="0"
        onChange={handleChange}
        onKeyDown={onKeyDown}
        className="w-[56px] bg-transparent border-0 outline-none text-center font-mono font-bold text-[16px] text-ink-900 tabular-nums"
      />

      <button
        type="button"
        onClick={() => handleStep('plus')}
        aria-label="Increase quantity"
        className="size-[28px] rounded-full bg-cream-200 hover:bg-sand-300 active:scale-95 text-stone-600 flex items-center justify-center transition-all cursor-pointer shrink-0"
      >
        <Plus className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
};

export default Incremental;
