"use client"
import React from 'react';

const StatItem = ({ 
  icon: Icon, 
  label, 
  value, 
  unit 
}: { 
  icon: React.ElementType, 
  label: string, 
  value: string | number | undefined, 
  unit?: string 
}) => {
  return (
    <div className=' flex items-center justify-between gap-3 py-2 px-1 rounded-lg'>
      {/* Icon with hashtag style */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
        <Icon size={16} className='text-gray-600' />
      </div>
      
      {/* Label with hashtag prefix */}
      <div className="flex-1 min-w-0">
        <span className="text-md text-gray-500 font-medium">
          {label.toLowerCase()}
        </span>
      </div>
      
      {/* Value */}
      <div className="flex-shrink-0">
        <span className="text-lg text-gray-900 tabular-nums border-1 p-1 rounded-md border-gray-100 bg-green-50">
          {unit === '€' && '€ '}
          {value}
          {unit === '%' && '%'}
        </span>
      </div>
    </div>
  );
};

export default StatItem;