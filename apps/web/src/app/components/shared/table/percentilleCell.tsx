import React from 'react';

interface PercentilleCellProps {
  percentage: number | string;
}

const PercentilleCell = ({ percentage }: PercentilleCellProps) => {
  const val = Number(percentage || 0);
  // If stored as decimal like 0.13 -> 13%, if already > 1 -> keep as is
  const displayVal = val <= 1 && val > 0 ? Math.round(val * 100) : Math.round(val);

  return (
    <span className="font-mono font-semibold text-[14px] tabular-nums text-ink-700">
      {displayVal}%
    </span>
  );
};

export default PercentilleCell;
