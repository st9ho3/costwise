import React, { memo } from 'react';

type CalculateButtonProps = {
  onCalculate: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const CalculateButton = memo(({ onCalculate }: CalculateButtonProps) => {

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors w-full sm:w-auto flex-shrink-0">
      <button type="button" onClick={onCalculate}>
        Calculate
      </button>
    </div>
  );
});

CalculateButton.displayName = "CalculateButton"
export default CalculateButton;