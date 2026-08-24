'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Camera,
  Trash2,
  Utensils,
  Plus,
  Sparkles,
} from 'lucide-react';
import { RecipeCategory } from '@costwise/shared/recipe';
import useRecipeForm from '@/app/hooks/useRecipeForm';
import { Input } from '../../ui/input';
import { MoneyInput } from '../../ui/moneyInput';
import { Button } from '../../ui/button';
import { IconButton } from '../../ui/iconButton';
import { Select } from '../../ui/select';
import Incremental from '../../shared/incremental';
import { EmptyState } from '../../ui/emptyState';
import { useFileStore } from '@/app/stores/fileStore';
import { useNotificationStore } from '@/app/stores/notificationStore';
import { CategoryThumbnail } from '@/app/utils/uiHelpers';
import { calculateProfitMargin, calculateSellingPrice, formatPrice, getTotalPrice } from '@costwise/shared/pricing';
import { RecipeFormProps } from './types';

export default function RecipeForm({
  ingredients,
  recipe,
  recipeIngredients,
  mode,
  userId,
}: RecipeFormProps) {
  const router = useRouter();
  const file = useFileStore((state) => state.file);
  const setFile = useFileStore((state) => state.setFile);
  const notify = useNotificationStore((state) => state.notify);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    errors,
    isSubmitting,
    handleAddIngredient,
    handleRemoveIngredient,
    onSubmit,
    tempIngredients,
    watch,
    newId,
  } = useRecipeForm({ ingredients, recipe, recipeIngredients, mode, userId });

  // State for ingredient draft row
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('g');
  const [ingredientQuantity, setIngredientQuantity] = useState<number>(100);

  // Pricing mode state: 'price' | 'margin'
  const [pricingMode, setPricingMode] = useState<'price' | 'margin'>(
    recipe?.profitMargin ? 'margin' : 'price'
  );

  const currentTitle = watch('title');
  const currentSellingPrice = watch('sellingPrice');
  const currentProfitMargin = watch('profitMargin');
  const currentTax = watch('tax') ?? 0.13;
  const currentCategory = watch('category') ?? 'main';

  // Live cogs calculation
  const liveCogs = getTotalPrice(tempIngredients);

  const handleAddPlateIngredient = () => {
    if (!selectedIngredientId) {
      notify('warning', 'Pick an ingredient from the list first.');
      return;
    }
    if (ingredientQuantity <= 0) {
      notify('warning', 'Give me a quantity greater than zero.');
      return;
    }

    const matched = ingredients.find((i) => i.id === selectedIngredientId);
    if (!matched) return;

    const unitPrice = Number(matched.unitPrice || 0);

    handleAddIngredient({
      recipeId: recipe?.id || newId,
      ingredientId: matched.id,
      name: matched.name,
      quantity: ingredientQuantity,
      unit: selectedUnit,
      unitPrice: unitPrice,
    });

    // Reset draft fields
    setSelectedIngredientId('');
    setIngredientQuantity(100);
    notify('success', `On the plate — ${matched.name} added.`);
  };

  const handleWorkItOut = () => {
    const taxNum = Number(currentTax !== undefined && currentTax !== null ? currentTax : 0.13);
    if (pricingMode === 'price') {
      const priceNum = Number(getValues('sellingPrice') || 0);
      if (priceNum <= 0 || liveCogs <= 0) {
        notify('warning', 'One number short — give me a menu price and some ingredients first.');
        return;
      }
      const margin = calculateProfitMargin(liveCogs, priceNum, taxNum);
      if (margin !== undefined) {
        setValue('profitMargin', Math.round(margin * 10) / 10, { shouldValidate: true });
        notify('success', `Worked out — at €${priceNum.toFixed(2)} you keep ${(Math.round(margin * 10) / 10).toFixed(1)}%.`);
      }
    } else {
      const marginNum = Number(getValues('profitMargin') || 0);
      if (marginNum <= 0 || liveCogs <= 0) {
        notify('warning', 'One number short — give me a margin % and some ingredients first.');
        return;
      }
      if (1 - taxNum - marginNum / 100 <= 0) {
        notify('warning', 'That one is tight — VAT and margin add up past 100%, try a smaller margin.');
        return;
      }
      const price = calculateSellingPrice(liveCogs, marginNum, taxNum);
      if (price !== undefined) {
        setValue('sellingPrice', Math.round(price * 100) / 100, { shouldValidate: true });
        notify('success', `Worked out — at €${(Math.round(price * 100) / 100).toFixed(2)} you keep ${marginNum.toFixed(1)}%.`);
      }
    }
  };

  const calculatedMargin =
    currentSellingPrice && liveCogs > 0
      ? calculateProfitMargin(liveCogs, Number(currentSellingPrice), Number(currentTax !== undefined && currentTax !== null ? currentTax : 0.13))
      : currentProfitMargin;

  const calculatedFoodCost =
    currentSellingPrice && Number(currentSellingPrice) > 0
      ? (liveCogs / Number(currentSellingPrice)) * 100
      : 0;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[1160px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconButton
          icon={<ArrowLeft className="size-5" strokeWidth={1.75} />}
          variant="outline"
          label="Back to dishes"
          onClick={() => router.push('/recipes')}
        />
        <div>
          <h1 className="font-display font-bold text-[28px] sm:text-[30px] text-ink-900 leading-snug">
            {mode === 'edit' ? 'Change this dish' : 'A new dish'}
          </h1>
          <p className="font-body text-[15px] text-stone-500">
            Add what goes on the plate and I&apos;ll work out what it costs you.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
          {/* LEFT COLUMN: 3 Cards */}
          <div className="flex flex-col gap-5">
            {/* Card 1: Title, Category & Photo Dropzone */}
            <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-5 sm:p-6 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col gap-4">
              <Input
                label="What's the dish called?"
                placeholder="Spaghetti carbonara"
                size="lg"
                defaultValue={currentTitle}
                error={errors.title?.message}
                {...register('title')}
              />

              <Select
                label="Course category"
                value={currentCategory}
                options={[
                  { value: 'starter', label: 'Starter' },
                  { value: 'main', label: 'Main course' },
                  { value: 'dessert', label: 'Dessert' },
                ]}
                onValueChange={(val) => setValue('category', val as RecipeCategory, { shouldValidate: true })}
              />

              {/* Photo dropzone */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[13px] text-ink-900 select-none">
                  Photo of the dish
                </label>
                <label className="flex items-center gap-4 p-4 rounded-[16px] border border-dashed border-sand-400 bg-cream-50/70 hover:bg-cream-100 hover:border-sand-500 cursor-pointer transition-all duration-140">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                        notify('info', `Photo selected: ${e.target.files[0].name}`);
                      }
                    }}
                  />
                  <span className="size-[44px] rounded-full bg-cream-200 text-stone-600 flex items-center justify-center shrink-0">
                    <Camera className="size-5" strokeWidth={1.75} />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[15px] text-ink-900 leading-snug">
                      {file ? file.name : recipe?.imgPath ? 'Change the dish photo' : 'Add a photo of the plate'}
                    </span>
                    <span className="text-[12px] text-stone-500">
                      Handy on the menu later — skip it if you&apos;re in a rush.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Card 2: What goes on the plate */}
            <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-5 sm:p-6 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col gap-4">
              <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
                What goes on the plate
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_0.9fr_auto_auto] gap-3 items-end">
                <Select
                  label="Ingredient"
                  placeholder="Pick an ingredient"
                  value={selectedIngredientId}
                  onValueChange={(val) => {
                    setSelectedIngredientId(val);
                    const found = ingredients.find((i) => i.id === val);
                    if (found?.unit) {
                      setSelectedUnit(found.unit === 'kg' ? 'g' : found.unit === 'L' ? 'ml' : found.unit);
                    }
                  }}
                  options={ingredients.map((ing) => {
                    const pricePerUnit = Number(ing.unitPrice || 0);
                    return {
                      value: ing.id,
                      label: `${ing.name} (€${formatPrice(pricePerUnit)}/${ing.unit || 'g'})`,
                    };
                  })}
                />

                <Select
                  label="Measured in"
                  value={selectedUnit}
                  onValueChange={(val) => setSelectedUnit(val)}
                  options={[
                    { value: 'g', label: 'Grams (g)' },
                    { value: 'kg', label: 'Kilos (kg)' },
                    { value: 'ml', label: 'Millilitres (ml)' },
                    { value: 'L', label: 'Litres (L)' },
                    { value: 'piece', label: 'Pieces' },
                  ]}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[13px] text-ink-900 select-none">
                    How much?
                  </label>
                  <Incremental
                    count={ingredientQuantity}
                    onRecipeIngredientChange={setIngredientQuantity}
                    step={selectedUnit === 'g' || selectedUnit === 'ml' ? 50 : 1}
                  />
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  iconLeft={<Plus className="size-4" />}
                  onClick={handleAddPlateIngredient}
                  className="shrink-0"
                >
                  Add to plate
                </Button>
              </div>
            </div>

            {/* Card 3: Pricing & Target Margin */}
            <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-5 sm:p-6 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col gap-5">
              <div>
                <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
                  Setting the price
                </span>
                <p className="font-body text-[14px] text-stone-500 mt-1">
                  Tell me what you want to charge or what you want to keep — I&apos;ll work out the rest.
                </p>
              </div>

              {/* Radio Option 1: Set Menu Price */}
              <div
                onClick={() => setPricingMode('price')}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-[16px] transition-all cursor-pointer gap-3 border ${
                  pricingMode === 'price'
                    ? 'bg-green-50/70 border-green-500'
                    : 'bg-white border-[#EFE8DA] hover:border-sand-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-[18px] rounded-full flex items-center justify-center border transition-all ${
                      pricingMode === 'price'
                        ? 'border-[5px] border-green-700 bg-white'
                        : 'border-[1.5px] border-sand-400 bg-white'
                    }`}
                  />
                  <span className="font-semibold text-[15px] text-ink-900">
                    I set the menu price
                  </span>
                </div>

                <div className="w-full sm:w-[160px]" onClick={(e) => e.stopPropagation()}>
                  <MoneyInput
                    placeholder="15.50"
                    disabled={pricingMode !== 'price'}
                    defaultValue={
                      currentSellingPrice !== undefined && !isNaN(Number(currentSellingPrice))
                        ? Number(currentSellingPrice)
                        : undefined
                    }
                    {...register('sellingPrice', { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* Radio Option 2: Set Profit Margin */}
              <div
                onClick={() => setPricingMode('margin')}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-[16px] transition-all cursor-pointer gap-3 border ${
                  pricingMode === 'margin'
                    ? 'bg-green-50/70 border-green-500'
                    : 'bg-white border-[#EFE8DA] hover:border-sand-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`size-[18px] rounded-full flex items-center justify-center border transition-all ${
                      pricingMode === 'margin'
                        ? 'border-[5px] border-green-700 bg-white'
                        : 'border-[1.5px] border-sand-400 bg-white'
                    }`}
                  />
                  <span className="font-semibold text-[15px] text-ink-900">
                    I set what I keep
                  </span>
                </div>

                <div className="w-full sm:w-[160px]" onClick={(e) => e.stopPropagation()}>
                  <Input
                    suffix="%"
                    placeholder="68"
                    disabled={pricingMode !== 'margin'}
                    defaultValue={
                      currentProfitMargin !== undefined && !isNaN(Number(currentProfitMargin))
                        ? Number(currentProfitMargin)
                        : undefined
                    }
                    {...register('profitMargin', { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* Sunken Row: VAT + Work it out Button */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between p-4 rounded-[16px] bg-cream-50 border border-[#EFE8DA] gap-3">
                <div className="w-full sm:w-[220px]">
                  <Select
                    label="VAT on top"
                    value={String(currentTax !== undefined && currentTax !== null ? currentTax : '0.13')}
                    options={[
                      { value: '0', label: 'No VAT (0%)' },
                      { value: '0.13', label: 'Food service (13%)' },
                      { value: '0.24', label: 'Standard (24%)' },
                    ]}
                    onValueChange={(val) => {
                      const numVal = parseFloat(val);
                      setValue('tax', isNaN(numVal) ? 0.13 : numVal, { shouldValidate: true });
                    }}
                  />
                </div>

                <Button
                  type="button"
                  variant="accent"
                  iconLeft={<Sparkles className="size-4" />}
                  onClick={handleWorkItOut}
                >
                  Work it out
                </Button>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Link href="/recipes">
                  <Button variant="secondary" type="button">
                    Cancel
                  </Button>
                </Link>

                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {mode === 'edit' ? 'Save the changes' : 'Save the dish'}
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Live "On the Plate" Summary */}
          <div className="sticky top-20 bg-white rounded-[18px] border border-[#EFE8DA] p-5 sm:p-6 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col gap-4">
            <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
              On the plate
            </span>

            {/* Ingredients Line List */}
            {tempIngredients.length === 0 ? (
              <EmptyState
                compact
                icon={<Utensils className="size-6 text-sand-400" />}
                title="Nothing on the plate yet"
                message="Pick an ingredient on the left and I'll start adding it up."
              />
            ) : (
              <div className="flex flex-col divide-y divide-[#EFE8DA] max-h-[300px] overflow-y-auto">
                {tempIngredients.map((item, idx) => {
                  const lineTotal =
                    (Number(item.unitPrice || 0) * Number(item.quantity || 0)) *
                    (item.unit === 'kg' || item.unit === 'L' ? 1000 : 1);

                  const matchedIng = ingredients.find((i) => i.id === item.ingredientId);
                  const ingCategory = matchedIng?.category || (item as { ingredients?: { category?: string } }).ingredients?.category;
                  const ingName = item.name || matchedIng?.name || 'Ingredient';

                  return (
                    <div
                      key={`${item.ingredientId}-${idx}`}
                      className="flex items-center justify-between py-2.5 gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CategoryThumbnail category={ingCategory} size={30} />
                        <div className="flex flex-col truncate">
                          <span className="font-semibold text-[14px] text-ink-900 truncate">
                            {ingName}
                          </span>
                          <span className="text-[12px] text-stone-500 font-body">
                            {item.quantity} {item.unit || 'g'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-[14px] tabular-nums text-ink-900">
                          €{lineTotal.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(item.ingredientId)}
                          className="text-stone-400 hover:text-tomato-600 p-1 rounded transition-colors cursor-pointer"
                          title="Remove line"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Totals Breakdown Block */}
            <div className="border-t border-[#EFE8DA] pt-4 flex flex-col gap-2 font-body text-[14px]">
              <div className="flex justify-between items-center">
                <span className="text-ink-700">What it costs you</span>
                <span className="font-mono font-bold text-ink-900 tabular-nums">
                  €{liveCogs.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-ink-700">Menu price</span>
                <span className="font-mono font-bold text-ink-900 tabular-nums">
                  €{Number(currentSellingPrice || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-ink-700">What you keep</span>
                <span className="font-mono font-bold text-green-800 tabular-nums">
                  {calculatedMargin !== undefined ? `${Number(calculatedMargin).toFixed(1)}%` : '—'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500">Food cost</span>
                <span className="font-mono font-medium text-stone-500 tabular-nums">
                  {calculatedFoodCost > 0 ? `${calculatedFoodCost.toFixed(1)}%` : '—'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500">Things on it</span>
                <span className="font-mono font-medium text-stone-500 tabular-nums">
                  {tempIngredients.length} {tempIngredients.length === 1 ? 'line' : 'lines'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}