'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, FileText, Camera, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { DataRow } from '../ui/dataRow';
import { CategoryThumbnail } from '@/app/utils/uiHelpers';

export interface TodayProps {
  firstName: string;
  totalRecipes: number;
  totalIngredients: number;
  totalSuppliers: number;
  avgFoodCost: number;
  avgProfitMargin: number;
  recentRecipes?: Array<{
    id: string;
    title: string;
    sellingPrice?: string | number | null;
    profitMargin?: string | number | null;
    totalCost?: string | number | null;
    category?: string;
  }>;
  forceDayOne?: boolean;
}

const count = (n: number, singular: string, plural: string) =>
  `${n} ${n === 1 ? singular : plural}`;

const nextSteps = [
  {
    href: '/suppliers/create',
    icon: <Truck className="size-5" />,
    iconClass: 'bg-green-50 text-green-700',
    title: 'Add who you buy from',
    blurb: 'Your suppliers, so prices have somewhere to hang.',
    cta: 'Add a supplier',
  },
  {
    href: '/ingredients/create',
    icon: <FileText className="size-5" />,
    iconClass: 'bg-gold-100 text-gold-800',
    title: 'Add what you buy',
    blurb: 'What you paid and how much you got — I work out the rest.',
    cta: 'Add an ingredient',
  },
  {
    href: '/recipes/create',
    icon: <Camera className="size-5" />,
    iconClass: 'bg-green-50 text-green-700',
    title: 'Cost your first dish',
    blurb: 'Put ingredients on a plate and see what you keep.',
    cta: 'Add a dish',
  },
];

export default function TodayView({
  firstName,
  totalRecipes,
  totalIngredients,
  totalSuppliers,
  avgFoodCost,
  avgProfitMargin,
  recentRecipes = [],
  forceDayOne = false,
}: TodayProps) {
  const isDayOne = forceDayOne || totalRecipes === 0;

  if (isDayOne) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-8 lg:p-10 max-w-[860px] mx-auto w-full">
        <div>
          <h1 className="font-display font-bold text-[32px] sm:text-[38px] leading-[1.08] text-ink-900 tracking-[-0.02em]">
            Let&apos;s cost your first dish, {firstName}
          </h1>
          <p className="font-body text-[16px] sm:text-[17px] text-stone-500 mt-2">
            Nothing costed yet. Three short steps and you&apos;ll know what every plate keeps.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-stone-500 flex-wrap font-body">
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalRecipes}</strong>{' '}
            {totalRecipes === 1 ? 'dish' : 'dishes'}
          </span>
          <span>·</span>
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalIngredients}</strong>{' '}
            {totalIngredients === 1 ? 'ingredient' : 'ingredients'}
          </span>
          <span>·</span>
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalSuppliers}</strong>{' '}
            {totalSuppliers === 1 ? 'supplier' : 'suppliers'}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-display font-bold text-[18px] text-ink-900">Where to start</h2>

          {nextSteps.map((step) => (
            <div
              key={step.href}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[16px] bg-cream-100 border border-[#EFE8DA] gap-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`size-10 rounded-full flex items-center justify-center shrink-0 ${step.iconClass}`}
                >
                  {step.icon}
                </span>
                <div>
                  <strong className="block font-semibold text-[15px] text-ink-900">
                    {step.title}
                  </strong>
                  <span className="text-[13px] text-stone-500">{step.blurb}</span>
                </div>
              </div>
              <Link href={step.href}>
                <Button variant="secondary" size="sm">
                  {step.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[1160px] mx-auto w-full">
      <div className="flex flex-col gap-2 pb-2">
        <h1 className="font-display font-bold text-[32px] sm:text-[38px] leading-[1.08] text-ink-900 tracking-[-0.02em]">
          Where you stand, {firstName}
        </h1>
        <p className="font-body text-[16px] sm:text-[17px] text-stone-500">
          {count(totalRecipes, 'dish', 'dishes')} costed from{' '}
          {count(totalIngredients, 'ingredient', 'ingredients')}.
        </p>

        <div className="flex items-center gap-2 text-[13px] text-stone-500 flex-wrap font-body pt-1">
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalRecipes}</strong>{' '}
            {totalRecipes === 1 ? 'dish' : 'dishes'}
          </span>
          <span>·</span>
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalIngredients}</strong>{' '}
            {totalIngredients === 1 ? 'ingredient' : 'ingredients'}
          </span>
          <span>·</span>
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalSuppliers}</strong>{' '}
            {totalSuppliers === 1 ? 'supplier' : 'suppliers'}
          </span>
          {avgFoodCost > 0 && (
            <>
              <span>·</span>
              <span className="whitespace-nowrap">
                food cost{' '}
                <strong className="font-mono font-semibold text-ink-700 tabular-nums">
                  {avgFoodCost.toFixed(1)}%
                </strong>
              </span>
            </>
          )}
          {avgProfitMargin > 0 && (
            <>
              <span>·</span>
              <span className="whitespace-nowrap">
                you keep{' '}
                <strong className="font-mono font-semibold text-ink-700 tabular-nums">
                  {avgProfitMargin.toFixed(1)}%
                </strong>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-[20px] text-ink-900">
            Recently touched dishes
          </h2>
          <Link
            href="/recipes"
            className="font-semibold text-[13px] text-green-700 hover:text-green-900 inline-flex items-center gap-1"
          >
            All dishes <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-[#EFE8DA] rounded-[18px] p-2 sm:px-4 shadow-[0_1px_2px_rgba(27,26,22,0.05)]">
          {recentRecipes && recentRecipes.length > 0 ? (
            recentRecipes.slice(0, 4).map((recipe) => (
              <DataRow
                key={recipe.id}
                thumb={<CategoryThumbnail category={recipe.category} size={36} />}
                title={recipe.title}
                subtitle={`Cost €${Number(recipe.totalCost || 0).toFixed(2)} · Keep ${Math.round(
                  Number(recipe.profitMargin || 0)
                )}%`}
                amount={`€${Number(recipe.sellingPrice || 0).toFixed(2)}`}
                onClick={() => {
                  window.location.href = `/recipes/edit/${recipe.id}`;
                }}
              />
            ))
          ) : (
            <div className="py-6 text-center text-stone-500 font-body text-[14px]">
              No dishes recorded yet. Add a dish to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
