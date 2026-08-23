import type { ReactNode, FormHTMLAttributes, ChangeEvent } from 'react';
export interface ComposerProps extends Omit<FormHTMLAttributes<HTMLFormElement>,'onChange'> {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSend?: () => void;
  /** Round leading slot — usually the Costwise sparkle. */
  lead?: ReactNode;
  /** IconButtons before send: camera, attach, mic. */
  tools?: ReactNode;
  sendIcon?: ReactNode;
  /** Card radius instead of a floating pill. */
  flat?: boolean;
}
export declare function Composer(props: ComposerProps): JSX.Element;
