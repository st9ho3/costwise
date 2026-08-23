import React from 'react';
import { Badge } from '../ui/badge';
import { LabelType } from '@costwise/shared/specialTypes';

interface LabelProps {
  text: string | undefined | null;
  type?: LabelType | string;
}

const mapTypeToTone = (type?: string): 'good' | 'info' | 'watch' | 'over' | 'neutral' => {
  if (!type) return 'neutral';
  const t = type.toLowerCase();
  if (t === 'high' || t === 'same day' || t === 'good' || t === 'success') return 'good';
  if (t === 'medium' || t === '1-2 days' || t === '2-3 days' || t === 'info') return 'info';
  if (t === 'low' || t === 'watch' || t === 'warning') return 'watch';
  if (t === 'very_low' || t === 'over' || t === 'danger' || t === 'destructive') return 'over';
  return 'neutral';
};

const Label = ({ text, type }: LabelProps) => {
  if (!text) return null;
  const refinedText = text === 'Oils, Vinegars, & Condiments' ? 'Oils & Condiments' : text;
  const tone = mapTypeToTone(type);

  return (
    <Badge tone={tone}>
      {refinedText}
    </Badge>
  );
};

export default Label;