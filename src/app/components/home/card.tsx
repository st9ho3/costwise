// src/components/FinancialCard.jsx

import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


const Card = ({ title, value, Icon, color }: {title: string, value: number, Icon: LucideIcon, color: string }) => {
  return (
    <div
      className={`
        text-black bg-none ${color} rounded-2xl p-5 w-60 max-w-xs
        flex flex-col justify-between h-35
      `}
    >
      {/* Card Header */}
      <div className="flex justify-between items-start">
        <span className="text-base font-medium">{title}</span>
        <div className="icon">
          {title !== "Avg Food Cost" && title !== "Avg Profit Margin" ? <Icon className="w-8 h-8 opacity-90" strokeWidth={1.5} /> : null }
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-grow flex items-center gap-1 pt-2">
        <span className="text-4xl font-bold">{value} </span>
        {title === "Avg Food Cost" || title === "Avg Profit Margin" ? <Icon className="w-8 h-8 opacity-90" strokeWidth={1.5} /> : null}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <a href="#" className="flex items-center text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
          <span>More Info</span>
          <div className="ml-2 flex justify-center items-center bg-white/30 rounded-full w-5 h-5">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Card;