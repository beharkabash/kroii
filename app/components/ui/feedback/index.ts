/**
 * Feedback Components
 * Components for user feedback, notifications, and loading states
 */

export { ErrorBoundary, ErrorFallback } from './ErrorBoundary';

export { Badge, StatusBadge, CountBadge, NotificationBadge } from './Badge';
export type { BadgeProps } from './Badge';

export { Tooltip, SimpleTooltip, InfoTooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

export {
  LoadingSpinner,
  PageLoading,
  CardLoading,
  TableLoading,
  ButtonLoading,
  SectionLoading,
  DataLoading,
  CarSkeleton,
  FormSkeleton,
  StatsSkeleton,
  ListSkeleton,
  ChatSkeleton,
} from './LoadingStates';