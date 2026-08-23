'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { Supplier, IngredientCategory, DeliveryTime } from '@costwise/shared/recipe';
import useSuppliersForm, { FormInput } from '@/app/hooks/useSuppliersForm';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { IconButton } from '../ui/iconButton';
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '@/app/constants/data';
import { CATEGORIES } from '@/app/utils/uiHelpers';

interface SuppliersFormProps {
  userId: string;
  mode: 'create' | 'edit';
  supplier?: Supplier | undefined;
}

export default function SuppliersForm({ userId, mode, supplier }: SuppliersFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    onSubmit,
    formState: { isSubmitting },
    selectCategory,
    tempCategories,
  } = useSuppliersForm({ userId, mode, supplier });

  const categoryList = Object.values(CATEGORIES);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[860px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconButton
          icon={<ArrowLeft className="size-5" strokeWidth={1.75} />}
          variant="outline"
          label="Back to suppliers"
          onClick={() => router.push('/suppliers')}
        />
        <div>
          <h1 className="font-display font-bold text-[28px] sm:text-[30px] text-ink-900 leading-snug">
            {mode === 'edit' ? 'Change this supplier' : 'A new supplier'}
          </h1>
          <p className="font-body text-[15px] text-stone-500">
            Who you buy from, how you reach them, and when they drop off.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-[18px] border border-[#EFE8DA] p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,26,22,0.05)] flex flex-col gap-6">
          {/* Group 1: Identity */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
              Identity
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company name"
                placeholder="Metro Cash & Carry"
                size="lg"
                defaultValue={supplier?.name || ''}
                {...register('name')}
              />
              <Input
                label="Who you talk to"
                placeholder="Giorgos"
                size="lg"
                defaultValue={supplier?.contactPerson || ''}
                {...register('contactPerson')}
              />
            </div>
          </div>

          <div className="h-px bg-[#EFE8DA]" />

          {/* Group 2: Reach them */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
              Reach them
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Email address"
                type="email"
                placeholder="orders@metro.gr"
                defaultValue={supplier?.email || ''}
                {...register('email')}
              />
              <Input
                label="Phone number"
                type="tel"
                placeholder="210 123 4567"
                defaultValue={supplier?.phone || ''}
                {...register('phone')}
              />
              <Input
                label="Website"
                type="text"
                placeholder="www.metro.gr"
                defaultValue={supplier?.website || ''}
                {...register('website')}
              />
            </div>
          </div>

          <div className="h-px bg-[#EFE8DA]" />

          {/* Group 3: Terms */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
              Terms & Financials
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Delivery time"
                placeholder="Pick one"
                value={watch('deliveryTime') || ''}
                options={DELIVERY_OPTIONS}
                onValueChange={(val) => setValue('deliveryTime', val as DeliveryTime, { shouldValidate: true })}
              />

              <Select
                label="Payment terms"
                placeholder="Pick one"
                value={watch('financialData.paymentTerms') || ''}
                options={PAYMENT_OPTIONS}
                onValueChange={(val) => setValue('financialData.paymentTerms', val as NonNullable<FormInput['financialData']>['paymentTerms'], { shouldValidate: true })}
              />

              <Input
                label="Tax / VAT ID"
                placeholder="EL123456789"
                defaultValue={supplier?.financialData?.vatNumber || ''}
                {...register('financialData.vatNumber')}
              />
            </div>
          </div>

          <div className="h-px bg-[#EFE8DA]" />

          {/* Group 4: What they sell */}
          <div className="flex flex-col gap-3">
            <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
              What they sell
            </span>
            <p className="text-[13px] text-stone-500 font-body -mt-1">
              Select the categories of ingredients this supplier supplies.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {categoryList.map((cat) => {
                const isSelected = (tempCategories as string[]).includes(cat.id);
                const Icon = cat.icon;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id as IngredientCategory)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-140 border cursor-pointer select-none ${
                      isSelected
                        ? 'border-green-700 bg-green-50 text-green-800 shadow-xs'
                        : 'border-[#EFE8DA] bg-cream-50 text-ink-700 hover:bg-cream-100 hover:border-sand-400'
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
                    <span>{cat.name}</span>
                    {isSelected && <Check className="size-3.5 text-green-700 shrink-0" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/suppliers">
              <Button variant="secondary" type="button">
                Not yet
              </Button>
            </Link>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {mode === 'edit' ? 'Save the changes' : 'Add the supplier'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
