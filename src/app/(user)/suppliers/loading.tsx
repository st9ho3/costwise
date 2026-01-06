/**
 * Renders a loading state UI for a page.
 * This component is used by Next.js to display a skeleton while the main page content is being fetched.
 * It imports and returns the `TableSkeleton` component, providing a visual cue to the user that content is loading.
 */
import TableSkeleton from '@/app/components/shared/skeleton';

export default function Loading() {
  return <TableSkeleton />;
}