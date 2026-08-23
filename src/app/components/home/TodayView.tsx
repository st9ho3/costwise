'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  FileText,
  Truck,
  Check,
  Eye,
  ArrowRight,
  Camera,
  Bell,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { ProgressMeter } from '../ui/progressMeter';
import { DataRow } from '../ui/dataRow';
import { useNotificationStore } from '@/app/stores/notificationStore';
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

interface Proposal {
  id: string;
  type: 'reprice' | 'invoice' | 'supplier';
  isAccent?: boolean;
  overline: string;
  timing?: string;
  title: string;
  body: string;
  metrics?: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
  };
  primaryBtn: string;
  secondaryBtn: string;
  ghostBtn?: string;
  outcomeText: string;
}

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
  const notify = useNotificationStore((state) => state.notify);

  const isDayOne = forceDayOne || totalRecipes === 0;

  // Proposal states: 'open' | 'approved' | 'dismissed'
  const [proposalStatus, setProposalStatus] = useState<Record<string, 'open' | 'approved' | 'dismissed'>>({});
  const [clearedCount, setClearedCount] = useState(1); // starts at 1 (Costwise handled draft unasked)

  const proposals: Proposal[] = [
    {
      id: 'prop-1',
      type: 'reprice',
      isAccent: true,
      overline: 'Worth money · do it first',
      timing: 'Before lunch service',
      title: 'Move the carbonara to €15.50?',
      body: 'Eggs went up 14% at Metro on Tuesday. That took the plate cost to €3.90 and dropped your margin to 58.2%. Going to €15.50 gets you back to 68%.',
      metrics: {
        label1: 'On the menu now',
        val1: '€14.00',
        label2: 'Plate cost today',
        val2: '€3.90',
        label3: "You'd keep",
        val3: '68.0%',
      },
      primaryBtn: 'Use €15.50',
      secondaryBtn: 'Hold two weeks',
      ghostBtn: 'Look at the carbonara',
      outcomeText: 'Done — carbonara is €15.50 on the menu.',
    },
    {
      id: 'prop-2',
      type: 'invoice',
      overline: 'Housekeeping · Zeta Dairy',
      timing: '€188.20 total',
      title: 'Update four ingredient costs?',
      body: 'Zeta Dairy invoice from Thursday matches four ingredients on your list: Pecorino (+€0.80/kg), Parmigiano (flat), Ricotta (+€0.30/kg), Butter (−€0.20/kg).',
      primaryBtn: 'Update them',
      secondaryBtn: 'Look at the diff',
      outcomeText: 'Done — four ingredient prices updated and 6 dishes recosted.',
    },
    {
      id: 'prop-3',
      type: 'supplier',
      overline: 'Saving · €0.09 a plate',
      timing: 'Kritikos vs Metro',
      title: 'Buy tomatoes from Kritikos?',
      body: 'Kritikos is delivering Plum Tomatoes at €1.45/kg this week. You currently buy from Metro at €1.80/kg. Across your 3 tomato dishes that saves ~€24/week.',
      primaryBtn: 'Switch to Kritikos',
      secondaryBtn: 'Compare suppliers',
      outcomeText: 'Done — preferred supplier for Plum Tomatoes set to Kritikos.',
    },
  ];

  const handleApprove = (p: Proposal) => {
    setProposalStatus((prev) => ({ ...prev, [p.id]: 'approved' }));
    setClearedCount((c) => c + 1);
    notify('success', p.outcomeText);
  };

  const handleDismiss = (p: Proposal) => {
    setProposalStatus((prev) => ({ ...prev, [p.id]: 'dismissed' }));
    notify('info', "Left alone — I'll bring it up again Monday.");
  };

  const handleUndo = (p: Proposal) => {
    setProposalStatus((prev) => ({ ...prev, [p.id]: 'open' }));
    setClearedCount((c) => Math.max(1, c - 1));
    notify('info', 'Reverted back to proposal queue.');
  };

  const openQueueCount = proposals.filter((p) => (proposalStatus[p.id] || 'open') === 'open').length;

  if (isDayOne) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-8 lg:p-10 max-w-[860px] mx-auto w-full">
        {/* Agent Line */}
        <div className="flex items-center gap-2.5">
          <Avatar agent src="/images/logo-mark-transparent.png" size="sm" />
          <span className="font-bold text-[13px] text-green-800 font-body">Costwise</span>
          <span className="text-[12px] text-stone-500 font-body">read your invoice just now</span>
        </div>

        {/* Headline */}
        <div>
          <h1 className="font-display font-bold text-[32px] sm:text-[38px] leading-[1.08] text-ink-900 tracking-[-0.02em]">
            I&apos;ve read your invoice, {firstName}.
          </h1>
          <p className="font-body text-[16px] sm:text-[17px] text-stone-500 mt-2">
            You&apos;re getting set up — that&apos;s enough to start. Here is where you stand.
          </p>
        </div>

        {/* Stat Line */}
        <div className="flex items-center gap-2 text-[13px] text-stone-500 flex-wrap font-body">
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalRecipes || 2}</strong> dishes
          </span>
          <span>·</span>
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalIngredients || 11}</strong> ingredients
          </span>
          <span>·</span>
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalSuppliers || 1}</strong> supplier
          </span>
          <span>·</span>
          <span className="whitespace-nowrap">
            <strong className="font-mono font-semibold text-ink-700 tabular-nums">1</strong> invoice read
          </span>
        </div>

        {/* One Thing to Do Today Card */}
        <div className="rounded-[18px] bg-gold-100 border border-[#F0E3BE] p-5 sm:p-6 flex flex-col gap-3.5 text-gold-800 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-[11px] uppercase tracking-[0.08em] opacity-85">
              One thing to do today
            </span>
            <span className="text-[12px] opacity-75 font-medium">About a minute</span>
          </div>

          <h2 className="font-display font-bold text-[22px] sm:text-[24px] text-gold-800 leading-snug">
            Check two lines from Metro?
          </h2>

          <p className="font-body text-[15px] text-gold-800/90 leading-normal">
            I matched 9 lines to ingredients on your list, but couldn&apos;t be sure about &ldquo;EVOO 5L&rdquo; and &ldquo;Sea Salt Fine 10kg&rdquo;. Confirm them and I&apos;ll cost your dishes automatically.
          </p>

          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <Button
              variant="accent"
              iconLeft={<Eye className="size-4" />}
              onClick={() => notify('info', 'Opening invoice review lines...')}
            >
              Look at the two lines
            </Button>
            <Button
              variant="ghost"
              className="text-gold-800 hover:bg-gold-300/40"
              onClick={() => notify('info', "Saved for later today.")}
            >
              Later today
            </Button>
          </div>
        </div>

        {/* While you were signing up */}
        <div className="flex flex-col gap-3 max-w-[700px] text-[15px] sm:text-[16px] text-ink-700 leading-relaxed font-body">
          <h3 className="font-display font-bold text-[18px] text-ink-900">While you were signing up</h3>
          <p>
            I compared your Metro ingredient prices against Athens food-service averages. Your dairy is priced well, but olive oil is roughly <span className="font-mono font-bold text-ink-900 tabular-nums">12% higher</span> than average.{' '}
            <Link href="/ingredients" className="font-semibold text-green-700 underline underline-offset-4 hover:text-green-900">
              See the olive oil breakdown
            </Link>
          </p>
        </div>

        {/* What I'd do next */}
        <div className="flex flex-col gap-3">
          <h3 className="font-display font-bold text-[18px] text-ink-900">What I&apos;d do next</h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[16px] bg-cream-100 border border-[#EFE8DA] gap-3">
            <div className="flex items-center gap-3">
              <span className="size-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                <Camera className="size-5" />
              </span>
              <div>
                <strong className="block font-semibold text-[15px] text-ink-900">Add your signature dish</strong>
                <span className="text-[13px] text-stone-500">Snap a recipe or type what goes on the plate.</span>
              </div>
            </div>
            <Link href="/recipes/create">
              <Button variant="secondary" size="sm">
                Add a dish
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[16px] bg-cream-100 border border-[#EFE8DA] gap-3">
            <div className="flex items-center gap-3">
              <span className="size-10 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0">
                <Bell className="size-5" />
              </span>
              <div>
                <strong className="block font-semibold text-[15px] text-ink-900">Set up margin watch</strong>
                <span className="text-[13px] text-stone-500">I&apos;ll flag dishes that drop below 65% margin.</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => notify('success', 'Margin watch set to 65%.')}
            >
              Set a watch
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Everyday state: The Decision Queue
  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8 lg:px-10 lg:py-8 max-w-[1160px] mx-auto w-full">
      {/* 1. Header Row + Stat Line + Cleared Counter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2">
          <h1 className="font-display font-bold text-[32px] sm:text-[38px] leading-[1.08] text-ink-900 tracking-[-0.02em]">
            {openQueueCount === 0
              ? 'All cleared before service'
              : openQueueCount === 1
              ? 'One for you before service'
              : `${openQueueCount === 2 ? 'Two' : 'Three'} for you before service`}
          </h1>
          <p className="font-body text-[16px] sm:text-[17px] text-stone-500">
            {openQueueCount === 0
              ? `Great job, ${firstName} — nothing urgent on the queue.`
              : `Nothing's broken, ${firstName} — one of them is worth money, two are housekeeping.`}
          </p>

          {/* Stat line */}
          <div className="flex items-center gap-2 text-[13px] text-stone-500 flex-wrap font-body pt-1">
            <span className="whitespace-nowrap">
              <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalRecipes}</strong> dishes
            </span>
            <span>·</span>
            <span className="whitespace-nowrap">
              <strong className="font-mono font-semibold text-ink-700 tabular-nums">{totalIngredients}</strong> ingredients
            </span>
            <span>·</span>
            <span className="whitespace-nowrap">
              food cost <strong className="font-mono font-semibold text-ink-700 tabular-nums">{avgFoodCost ? `${avgFoodCost.toFixed(1)}%` : '28.4%'}</strong>
              <span className="text-green-700 font-bold ml-1">↓ 1.2</span>
            </span>
            <span>·</span>
            <span className="whitespace-nowrap">
              you keep <strong className="font-mono font-semibold text-ink-700 tabular-nums">{avgProfitMargin ? `${avgProfitMargin.toFixed(1)}%` : '67.8%'}</strong>
              <span className="text-green-700 font-bold ml-1">↑ 2.1</span>
            </span>
          </div>
        </div>

        {/* Cleared Counter */}
        <div className="flex flex-col items-start md:items-end gap-1.5 w-full sm:w-[220px] shrink-0">
          <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500">
            Cleared today
          </span>
          <span className="font-mono font-semibold text-[14px] text-ink-900 tabular-nums">
            {clearedCount} of {proposals.length + 1} done
          </span>
          <div className="w-full">
            <ProgressMeter
              value={clearedCount}
              max={proposals.length + 1}
              tone="good"
              height={8}
            />
          </div>
        </div>
      </div>

      {/* 2. The Decision Queue Cards */}
      <div className="flex flex-col gap-4">
        {proposals.map((proposal) => {
          const status = proposalStatus[proposal.id] || 'open';
          if (status === 'dismissed') return null;

          const isAccent = proposal.isAccent;

          return (
            <div
              key={proposal.id}
              className={`rounded-[18px] p-5 sm:p-6 transition-all duration-200 ${
                isAccent
                  ? 'bg-gold-100 border border-[#F0E3BE] shadow-sm text-gold-800'
                  : 'bg-white border border-[#EFE8DA] shadow-[0_1px_2px_rgba(27,26,22,0.05)] text-ink-900'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-7 rounded-full flex items-center justify-center ${
                      isAccent ? 'bg-gold-300/60 text-gold-800' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {proposal.type === 'reprice' ? (
                      <TrendingUp className="size-4" />
                    ) : proposal.type === 'invoice' ? (
                      <FileText className="size-4" />
                    ) : (
                      <Truck className="size-4" />
                    )}
                  </span>
                  <span
                    className={`font-bold text-[11px] uppercase tracking-[0.08em] ${
                      isAccent ? 'text-gold-800' : 'text-stone-500'
                    }`}
                  >
                    {proposal.overline}
                  </span>
                </div>

                {proposal.timing && (
                  <span
                    className={`text-[12px] font-medium font-mono ${
                      isAccent ? 'text-gold-800/80' : 'text-stone-500'
                    }`}
                  >
                    {proposal.timing}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2
                className={`font-display font-bold text-[20px] sm:text-[22px] leading-snug mb-2 ${
                  isAccent ? 'text-gold-800' : 'text-ink-900'
                }`}
              >
                {proposal.title}
              </h2>

              {/* Body */}
              <p
                className={`font-body text-[15px] leading-normal mb-4 ${
                  isAccent ? 'text-gold-800/90' : 'text-ink-700'
                }`}
              >
                {proposal.body}
              </p>

              {/* 3-up Figures Row for Reprice Card */}
              {proposal.metrics && (
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-[12px] bg-white/70 border border-[#F0E3BE] mb-4 text-center sm:text-left">
                  <div>
                    <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-tight">
                      {proposal.metrics.label1}
                    </span>
                    <span className="font-mono font-bold text-[16px] text-ink-900 tabular-nums">
                      {proposal.metrics.val1}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-tight">
                      {proposal.metrics.label2}
                    </span>
                    <span className="font-mono font-bold text-[16px] text-ink-900 tabular-nums">
                      {proposal.metrics.val2}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-tight">
                      {proposal.metrics.label3}
                    </span>
                    <span className="font-mono font-bold text-[16px] text-green-800 tabular-nums">
                      {proposal.metrics.val3}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions or Approved State */}
              {status === 'approved' ? (
                <div className="flex items-center justify-between pt-1">
                  <span className="flex items-center gap-2 font-bold text-[15px] text-green-700">
                    <Check className="size-5" />
                    {proposal.outcomeText}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUndo(proposal)}
                    className="font-medium text-[13px] text-stone-500 underline hover:text-ink-900 cursor-pointer"
                  >
                    Undo
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <Button
                    variant={isAccent ? 'primary' : 'primary'}
                    onClick={() => handleApprove(proposal)}
                  >
                    {proposal.primaryBtn}
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => handleDismiss(proposal)}
                  >
                    {proposal.secondaryBtn}
                  </Button>

                  {proposal.ghostBtn && (
                    <Link href="/recipes">
                      <Button variant="ghost">
                        {proposal.ghostBtn}
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Done Strip */}
      <div className="flex items-center justify-between p-4 rounded-[16px] bg-cream-100 border border-[#EFE8DA] gap-3">
        <div className="flex items-center gap-3">
          <span className="size-7 rounded-full bg-green-100 text-green-800 flex items-center justify-center shrink-0">
            <Check className="size-4" strokeWidth={2.5} />
          </span>
          <span className="font-body text-[14px] sm:text-[15px] text-ink-700">
            Friday&apos;s Kritikos order drafted, 11 lines, €146.00
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => notify('info', 'Viewing order draft...')}
        >
          Look at the draft
        </Button>
      </div>

      {/* 4. Last Touched Dishes */}
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
                subtitle={`Cost €${Number(recipe.totalCost || 0).toFixed(2)} · Keep ${Math.round(Number(recipe.profitMargin || 0))}%`}
                amount={`€${Number(recipe.sellingPrice || 0).toFixed(2)}`}
                onClick={() => {
                  window.location.href = `/recipes/edit/${recipe.id}`;
                }}
              />
            ))
          ) : (
            <div className="py-6 text-center text-stone-500 font-body text-[14px]">
              No dishes recorded yet. Click &ldquo;Add a dish&rdquo; to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
