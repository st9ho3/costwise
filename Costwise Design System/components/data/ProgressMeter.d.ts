import type { ReactNode } from 'react';
export interface MeterSegment { value: number; color?: string; label?: string }
export interface ProgressMeterProps {
  label?: string;
  value?: number;
  max?: number;
  tone?: 'good' | 'watch' | 'over' | 'brand' | 'info' | string;
  /** Right-aligned readout, e.g. "€3.10 of €4.20". */
  display?: string;
  /** Draws the target notch — the number the owner is aiming at. */
  target?: number;
  caption?: ReactNode;
  /** Stacked breakdown (ingredients, categories) using the viz ramp. */
  segments?: MeterSegment[];
  thick?: boolean;
}
export declare function ProgressMeter(props: ProgressMeterProps): JSX.Element;
