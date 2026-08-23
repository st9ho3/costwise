"use client"

import React, { useMemo } from 'react';
import { RecipeIngredients } from '@costwise/shared/recipe';
import { getTotalPrice } from '@costwise/shared/pricing';
import {  ShoppingBasket,TrendingUp, UtensilsCrossed, BadgeCent, Banknote } from 'lucide-react';
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormFields } from '../../recipeForm';
import StatItem from './statItem';

const OrderTotal = ({ ingredients, watch }: { ingredients: RecipeIngredients[], getValues: UseFormGetValues<FormFields> , setValue: UseFormSetValue<FormFields>, watch: UseFormWatch<FormFields>}) => {

  const totalCost = useMemo(() => getTotalPrice(ingredients),[ingredients] )

  const sellingPrice = watch('sellingPrice');
  const profitMargin = watch('profitMargin');
  const foodCost = sellingPrice ? (totalCost / sellingPrice) * 100 : 0;
  const ingredientCount = ingredients.length;

  return (
    <div className="mt-1 p-2 w-full border-t border-dashed border-gray-300 flex flex-col justify-between ">
      <StatItem 
        icon={Banknote}
        label="Cost of goods"
        value={totalCost.toFixed(2)}
        unit="€"
      />
      <StatItem 
        icon={BadgeCent}
        label="Selling price"
        value={sellingPrice}
        unit="€"
      />
      <StatItem 
        icon={TrendingUp}
        label="Profit margin"
        value={profitMargin}
        unit="%"
      />
      <StatItem 
        icon={UtensilsCrossed}
        label="Food Cost"
        value={foodCost?.toFixed(2)}
        unit="%"
      />
      <StatItem 
        icon={ShoppingBasket}
        label="Items"
        value={ingredientCount}
      />
    </div>
  );
};

export default OrderTotal;