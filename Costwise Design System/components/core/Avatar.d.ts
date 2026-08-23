export interface AvatarProps {
  name?: string;
  /** Image URL. For the assistant pass the Costwise mark with agent. */
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Deep-green padded plate — the Costwise assistant's own avatar. */
  agent?: boolean;
  online?: boolean;
  style?: import('react').CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
