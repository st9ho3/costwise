 /**
 * The Costwise lockup: coin-broccoli mark + rounded wordmark.
 */
export interface LogoProps {
  /** Mark pixel size; the wordmark scales from it. Default 28. */
  size?: number;
  variant?: 'full' | 'mark';
  /** Cream wordmark, for deep-green surfaces. */
  inverse?: boolean;
  /** Wraps the mark on a green rounded plate (app-icon treatment). */
  plate?: boolean;
  /** Path to the mark PNG, relative to the consuming page. */
  src?: string;
}
export declare function Logo(props: LogoProps): JSX.Element;
