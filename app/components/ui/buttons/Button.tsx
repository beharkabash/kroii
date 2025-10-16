'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/app/lib/core/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  motionProps?: MotionProps;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    motionProps,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-semibold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'active:scale-95',
    ];

    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-purple-600 to-pink-500',
        'text-white shadow-lg',
        'hover:shadow-xl hover:shadow-purple-500/30',
        'focus:ring-purple-500',
      ],
      secondary: [
        'bg-slate-100 text-slate-900',
        'hover:bg-slate-200',
        'focus:ring-slate-500',
      ],
      outline: [
        'border-2 border-purple-300 text-purple-600',
        'hover:bg-purple-50 hover:border-purple-400',
        'focus:ring-purple-500',
      ],
      ghost: [
        'text-purple-600 hover:bg-purple-50',
        'focus:ring-purple-500',
      ],
      destructive: [
        'bg-red-600 text-white',
        'hover:bg-red-700',
        'focus:ring-red-500',
      ],
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
      md: 'px-4 py-2 text-base rounded-lg gap-2',
      lg: 'px-6 py-3 text-lg rounded-lg gap-2',
      xl: 'px-8 py-4 text-xl rounded-xl gap-3',
    };

    const classes = cn([
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className,
    ]);

    const defaultMotionProps: MotionProps = {
      whileHover: { scale: disabled || loading ? 1 : 1.02 },
      whileTap: { scale: disabled || loading ? 1 : 0.98 },
      ...motionProps,
    };

    const content = (
      <>
        {loading && (
          <Loader2 className={cn(
            'animate-spin',
            size === 'sm' ? 'h-3 w-3' :
            size === 'md' ? 'h-4 w-4' :
            size === 'lg' ? 'h-5 w-5' : 'h-6 w-6'
          )} />
        )}
        {!loading && leftIcon && (
          <span className={cn(
            'flex items-center',
            size === 'sm' ? 'h-3 w-3' :
            size === 'md' ? 'h-4 w-4' :
            size === 'lg' ? 'h-5 w-5' : 'h-6 w-6'
          )}>
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className={cn(
            'flex items-center',
            size === 'sm' ? 'h-3 w-3' :
            size === 'md' ? 'h-4 w-4' :
            size === 'lg' ? 'h-5 w-5' : 'h-6 w-6'
          )}>
            {rightIcon}
          </span>
        )}
      </>
    );

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...defaultMotionProps}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };