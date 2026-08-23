'use client';

import React from 'react';
import { Utensils, Carrot, Truck } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/app/stores/uiStore';

interface OptionItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  description: string;
  bg: string;
  color: string;
  closeModal: () => void;
}

const OptionItem = ({
  href,
  icon: Icon,
  label,
  description,
  bg,
  color,
  closeModal,
}: OptionItemProps) => {
  return (
    <Link
      href={href}
      onClick={() => {
        setTimeout(() => closeModal(), 150);
      }}
      className="flex items-center gap-3.5 p-3.5 rounded-[16px] border border-[#EFE8DA] bg-white hover:bg-cream-100 hover:border-sand-400 hover:-translate-y-[1px] transition-all duration-140 group"
    >
      <div
        className="size-[44px] rounded-[12px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: bg, color: color }}
      >
        <Icon className="size-[22px]" strokeWidth={1.75} />
      </div>

      <div className="flex flex-col text-left">
        <span className="font-display font-bold text-[16px] text-ink-900 leading-snug group-hover:text-green-800 transition-colors">
          {label}
        </span>
        <span className="font-body text-[13px] text-stone-500 leading-normal">
          {description}
        </span>
      </div>
    </Link>
  );
};

const OptionsModal = () => {
  const closeModal = useUIStore((state) => state.closeModal);

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-4">
      {/* Header */}
      <div>
        <h3 className="font-display font-bold text-[22px] text-ink-900 tracking-tight">
          What are we adding?
        </h3>
        <p className="font-body text-[14px] text-stone-500 mt-0.5">
          Pick one and I&apos;ll open a blank form.
        </p>
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2.5">
        <OptionItem
          href="/recipes/create"
          icon={Utensils}
          label="A dish"
          description="What goes on the plate, and what you charge"
          bg="#FDEBDD"
          color="#9E4220"
          closeModal={closeModal}
        />

        <OptionItem
          href="/ingredients/create"
          icon={Carrot}
          label="An ingredient"
          description="Something you buy, and what it costs"
          bg="#E4F3D8"
          color="#1B4A2C"
          closeModal={closeModal}
        />

        <OptionItem
          href="/suppliers/create"
          icon={Truck}
          label="A supplier"
          description="Who you order from and when they deliver"
          bg="#E6EFF8"
          color="#3A6E9E"
          closeModal={closeModal}
        />
      </div>
    </div>
  );
};

export default OptionsModal;