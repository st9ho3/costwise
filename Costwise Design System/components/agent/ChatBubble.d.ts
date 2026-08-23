import type { ReactNode } from 'react';
/**
 * One turn in a conversation with Costwise.
 */
export interface ChatBubbleProps {
  /** "agent" = Costwise (white card, left). "me" = the owner (green, right). */
  from?: 'agent' | 'me';
  children?: ReactNode;
  /** Pass an <Avatar agent /> for Costwise turns. */
  avatar?: ReactNode;
  /** Timestamp / source line under the bubble. */
  meta?: ReactNode;
  /** Renders the three-dot thinking animation instead of children. */
  typing?: boolean;
  /** "note" = gold wash, for something Costwise spotted rather than said. */
  tone?: 'default' | 'note';
  /** Card, meter or row rendered under the bubble, inside the same column. */
  attachment?: ReactNode;
}
export declare function ChatBubble(props: ChatBubbleProps): JSX.Element;
