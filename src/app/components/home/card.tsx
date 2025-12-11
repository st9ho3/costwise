// src/components/FinancialCard.jsx

import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  value: number;
  Icon: LucideIcon;
  color: string;
}

const Card = ({ title, value, Icon }: CardProps) => {
  const isSpecialCategory = title === "Avg Food Cost" || title === "Avg Profit Margin";

  return (
    <div
      className={`
        relative w-60 h-[8.75rem] p-5
        flex flex-col justify-between
        
        /* SHAPE: Material 3 Large Rounded Corners */
        rounded-[24px]
        
        /* COLOR: Surface (White) with subtle border */
        bg-white border border-gray-200
        
        /* ELEVATION: Soft shadow that lifts on hover */
        shadow-sm hover:shadow-lg hover:shadow-gray-200/50
        
        /* ANIMATION: Standard Easing */
        transition-all duration-300 ease-[cubic-bezier(0.2,0.0,0,1.0)]
        hover:-translate-y-1
        
        group cursor-pointer
      `}
    >
      {/* Card Header: Title & FAB */}
      <div className="flex justify-between items-start">
        {/* Typography: Google Sans style (Medium Gray for labels) */}
        <span className="text-[15px] font-medium text-gray-600 tracking-wide">
          {title}
        </span>

        {/* FAB (Floating Action Button): 
            Top-right circle, distinct "Google Blue" or Light Surface interaction 
        */}
        <div className="
          flex items-center justify-center 
          w-9 h-9 rounded-full 
          bg-blue-50 text-blue-600
          transition-colors duration-300 
          group-hover:bg-blue-600 group-hover:text-white
        ">
          <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        </div>
      </div>

      {/* Card Body: Value & Icon */}
      <div className="flex items-end justify-between mt-auto">
        {/* Value: High-emphasis Dark Gray (almost black) */}
        <span className="text-5xl font-medium text-gray-900 tracking-tight tabular-nums leading-none">
          {value}
        </span>

        {/* Context Icon: 
            Subtle coloring to distinguish categories without overwhelming 
        */}
        <div className={`
          flex items-center justify-center w-10 h-10 rounded-full
          ${isSpecialCategory 
            ? 'bg-orange-50 text-orange-600' // Warm accent for costs
            : 'bg-blue-50 text-blue-600'     // Cool accent for general
          }
        `}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>

      {/* Material "Ripple" overlay (simulated via full card link) */}
      <a href="#" className="absolute inset-0 z-20 rounded-[24px]" aria-label="More Info"></a>
    </div>
  );
};

export default Card;