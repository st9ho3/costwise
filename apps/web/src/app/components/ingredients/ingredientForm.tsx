'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Ingredient, IngredientCategory, IngredientToDisplay, Unit } from '@costwise/shared/recipe';
import { useIngredientForm } from '@/app/hooks/useIngredientsForm';
import { SelectableItem } from '../shared/SelectStore';
import { Input } from '../ui/input';
import { MoneyInput } from '../ui/moneyInput';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { IconButton } from '../ui/iconButton';
import Incremental from '../shared/incremental';
import { CATEGORIES } from '@/app/utils/uiHelpers';
import { normalizePrice, formatPrice, getDisplayUnit } from '@costwise/shared/pricing';

export interface IngredientFormProps {
  ingredient?: Ingredient | IngredientToDisplay;
  mode: 'create' | 'edit';
  userId: string;
  supplierOptions: SelectableItem[];
}

export default function IngredientForm({
  ingredient,
  mode,
  userId,
  supplierOptions,
}: IngredientFormProps) {
  const router = useRouter();

  const {
    price,
    quantity,
    unit,
    name,
    error,
    register,
    handleSubmit,
    setValue,
    isSubmitting,
    setErrors,
    onSubmit,
  } = useIngredientForm({ ingredient, mode, userId, supplierOptions });

  const numPrice = Number(price || 0);
  const numQty = Number(quantity || 1);
  const normalized = normalizePrice(numPrice, (unit as Unit) || 'g', numQty);
  const displayUnit = getDisplayUnit(unit);

  const categoryList = Object.values(CATEGORIES).map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const ingredientWithSuppliers = ingredient as (Ingredient & { suppliers?: { suppliersId?: string }[] }) | undefined;
  const initialSupplierId =
    mode === 'edit' && ingredientWithSuppliers && Array.isArray(ingredientWithSuppliers.suppliers) && ingredientWithSuppliers.suppliers[0]?.suppliersId
      ? ingredientWithSuppliers.suppliers[0].suppliersId
      : undefined;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[760px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconButton
          icon={<ArrowLeft className="size-5" strokeWidth={1.75} />}
          variant="outline"
          label="Back to ingredients"
          onClick={() => router.push('/ingredients')}
        />
        <div>
          <h1 className="font-display font-bold text-[28px] sm:text-[30px] text-ink-900 leading-snug">
            {mode === 'edit' ? 'Change this ingredient' : 'A new ingredient'}
          </h1>
          <p className="font-body text-[15px] text-stone-500">
            Tell me what you paid and how much you got — I&apos;ll work out the rest.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col gap-6">
          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-4">
            <Input
              label="What is it?"
              placeholder="Pecorino romano"
              size="lg"
              defaultValue={name}
              {...register('name')}
            />

            <Select
              label="What kind?"
              defaultValue={ingredient?.category || categoryList[0]?.value}
              options={categoryList}
              onValueChange={(val) => setValue('category', val as IngredientCategory, { shouldValidate: true })}
            />
          </div>

          <div className="h-px bg-[#EFE8DA]" />

          {/* Row 2: Supplier, Quantity, Unit, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_auto_0.8fr_1fr] gap-4 items-end">
            <Select
              label="Who from?"
              placeholder="Pick a supplier"
              defaultValue={initialSupplierId}
              options={supplierOptions.map((s) => ({ value: s.id, label: s.name }))}
              onValueChange={(val) => setValue('suppliers.0.suppliersId', val, { shouldValidate: true })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-[13px] text-ink-900 select-none">
                How much you got
              </label>
              <Incremental
                count={numQty}
                step={unit === 'g' || unit === 'ml' ? 50 : 1}
                onIngredientChange={setValue}
                setErrors={setErrors}
              />
            </div>

            <Select
              label="In what"
              value={unit || 'kg'}
              options={[
                { value: 'kg', label: 'Kilos (kg)' },
                { value: 'g', label: 'Grams (g)' },
                { value: 'L', label: 'Litres (L)' },
                { value: 'ml', label: 'Millilitres (ml)' },
                { value: 'piece', label: 'Pieces' },
              ]}
              onValueChange={(val) => setValue('unit', val as Unit, { shouldValidate: true })}
            />

            <MoneyInput
              label="What you paid"
              placeholder="12.40"
              defaultValue={numPrice > 0 ? numPrice : undefined}
              {...register('unitPrice', { valueAsNumber: true })}
            />
          </div>

          {/* Live Summary Card */}
          {name && numPrice > 0 && (
            <div className="rounded-[16px] bg-green-50 border border-green-200/60 p-4 flex items-center gap-3 text-green-900 animate-in fade-in-0 duration-140">
              <span className="size-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                <Sparkles className="size-4" strokeWidth={2} />
              </span>
              <p className="font-body text-[15px] font-medium leading-snug">
                €{numPrice.toFixed(2)} for {numQty} {unit || 'kg'} works out at{' '}
                <strong className="font-mono font-bold tabular-nums">
                  €{formatPrice(normalized)}
                </strong>{' '}
                a {displayUnit}.
              </p>
            </div>
          )}

          {/* Validation Errors */}
          {error && error.length > 0 && (
            <div className="p-3.5 rounded-[12px] bg-tomato-50 border border-tomato-200 text-tomato-700 text-[13px] font-medium flex flex-col gap-1">
              {error.map((err, idx) => (
                <span key={idx}>• {err}</span>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/ingredients">
              <Button variant="secondary" type="button">
                Not yet
              </Button>
            </Link>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {mode === 'edit' ? 'Save the changes' : 'Add the ingredient'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}