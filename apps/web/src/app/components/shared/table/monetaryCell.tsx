import { formatPrice, getDisplayUnit } from '@costwise/shared/pricing';
import React from 'react';

interface MonetaryCellProps {
  price: number | string | undefined;
  unit?: string;
  type: 'absolute' | 'per_unit';
}

const MonetaryCell = ({ price, unit, type }: MonetaryCellProps) => {
  const numPrice = typeof price === 'string' && price.trim() !== '' ? Number(price) : price;

  if (type === 'absolute') {
    const validNum = typeof numPrice === 'number' && !isNaN(numPrice) ? numPrice : 0;
    return (
      <span className="font-mono font-semibold text-[14px] tabular-nums text-ink-900">
        €{validNum.toFixed(2)}
      </span>
    );
  }

  return (
    <div className="flex items-baseline gap-1">
      <span className="font-mono font-semibold text-[14px] tabular-nums text-ink-900">
        €{formatPrice(numPrice)}
      </span>
      <span className="font-body text-[12px] font-medium text-stone-500">
        / {getDisplayUnit(unit)}
      </span>
    </div>
  );
};

export default MonetaryCell;
