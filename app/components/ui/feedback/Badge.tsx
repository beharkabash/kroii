'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/core/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  leftIcon?: ReactNode;
  children: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    rounded = false,
    removable = false,
    onRemove,
    leftIcon,
    children,
    ...props
  }, ref) => {

    const baseClasses = [
      'inline-flex items-center gap-1.5 font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
    ];

    const variantClasses = {
      default: [
        'bg-gradient-to-r from-purple-100 to-pink-100',
        'text-purple-800 border border-purple-200',
        'focus:ring-purple-500',
      ],
      secondary: [
        'bg-slate-100 text-slate-800 border border-slate-200',
        'focus:ring-slate-500',
      ],
      success: [
        'bg-green-100 text-green-800 border border-green-200',
        'focus:ring-green-500',
      ],
      warning: [
        'bg-yellow-100 text-yellow-800 border border-yellow-200',
        'focus:ring-yellow-500',
      ],
      error: [
        'bg-red-100 text-red-800 border border-red-200',
        'focus:ring-red-500',
      ],
      info: [
        'bg-blue-100 text-blue-800 border border-blue-200',
        'focus:ring-blue-500',
      ],
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs rounded-md',
      md: 'px-2.5 py-1.5 text-sm rounded-lg',
      lg: 'px-3 py-2 text-base rounded-lg',
    };

    const iconSize = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const classes = cn([
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      rounded && 'rounded-full',
      className,
    ]);

    return (
      <motion.span
        ref={ref}
        className={classes}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {leftIcon && (
          <span className={iconSize[size]}>
            {leftIcon}
          </span>
        )}

        <span className="truncate">{children}</span>

        {removable && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className={cn(
              'flex-shrink-0 rounded-full hover:bg-black/10 transition-colors',
              'focus:outline-none focus:ring-1 focus:ring-current',
              iconSize[size]
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Poista badge"
          >
            <X className={iconSize[size]} />
          </motion.button>
        )}
      </motion.span>
    );
  }
);

Badge.displayName = 'Badge';

/**
 * Status Badge for displaying status indicators
 */
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'error';
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const statusConfig = {
      active: { variant: 'success' as const, text: 'Aktiivinen' },
      inactive: { variant: 'secondary' as const, text: 'Ei aktiivinen' },
      pending: { variant: 'warning' as const, text: 'Odottaa' },
      completed: { variant: 'success' as const, text: 'Valmis' },
      error: { variant: 'error' as const, text: 'Virhe' },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        {...props}
      >
        {config.text}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

/**
 * Count Badge for displaying numeric values
 */
interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

export const CountBadge = forwardRef<HTMLSpanElement, CountBadgeProps>(
  ({ count, max = 99, showZero = false, ...props }, ref) => {
    if (count === 0 && !showZero) {
      return null;
    }

    const displayCount = count > max ? `${max}+` : count.toString();

    return (
      <Badge
        ref={ref}
        variant="default"
        size="sm"
        rounded
        {...props}
      >
        {displayCount}
      </Badge>
    );
  }
);

CountBadge.displayName = 'CountBadge';

/**
 * Notification Badge (dot indicator)
 */
interface NotificationBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const NotificationBadge = forwardRef<HTMLSpanElement, NotificationBadgeProps>(
  ({ className, variant = 'default', size = 'md', pulse = false, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-purple-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    };

    const sizeClasses = {
      sm: 'h-2 w-2',
      md: 'h-3 w-3',
      lg: 'h-4 w-4',
    };

    return (
      <motion.span
        ref={ref}
        className={cn(
          'block rounded-full',
          variantClasses[variant],
          sizeClasses[size],
          pulse && 'animate-pulse',
          className
        )}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        {...props}
      />
    );
  }
);

NotificationBadge.displayName = 'NotificationBadge';

export { Badge };