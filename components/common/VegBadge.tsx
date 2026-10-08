import React from 'react';
import { VegType } from '@/lib/types';

interface VegBadgeProps {
  vegType?: VegType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function VegBadge({ vegType = 'VEG', size = 'md', showLabel = false }: VegBadgeProps) {
  const isVeg = vegType === 'VEG';

  const boxSizes = {
    sm: 'w-3.5 h-3.5 border',
    md: 'w-4 h-4 border-[1.5px]',
    lg: 'w-5 h-5 border-2',
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <div className="inline-flex items-center gap-1.5" title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
      <div
        className={`${boxSizes[size]} ${
          isVeg ? 'border-emerald-600 bg-white' : 'border-red-600 bg-white'
        } rounded-[3px] flex items-center justify-center shrink-0 shadow-xs`}
      >
        <div
          className={`${dotSizes[size]} rounded-full ${
            isVeg ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        />
      </div>
      {showLabel && (
        <span
          className={`text-xs font-medium tracking-wide uppercase ${
            isVeg ? 'text-emerald-800' : 'text-red-800'
          }`}
        >
          {isVeg ? 'Veg' : 'Non-Veg'}
        </span>
      )}
    </div>
  );
}
