'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/core/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  clickable?: boolean;
  children: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    clickable = false,
    children,
    ...props
  }, ref) => {

    const baseClasses = [
      'rounded-xl transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
    ];

    const variantClasses = {
      default: [
        'bg-white border border-slate-200',
        hoverable && 'hover:border-slate-300',
      ],
      elevated: [
        'bg-white shadow-lg border border-slate-100',
        hoverable && 'hover:shadow-xl',
      ],
      outlined: [
        'bg-transparent border-2 border-slate-300',
        hoverable && 'hover:border-purple-300 hover:bg-purple-50/30',
      ],
      filled: [
        'bg-slate-50 border border-slate-200',
        hoverable && 'hover:bg-slate-100',
      ],
    };

    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const hoverEffects = hoverable || clickable ? {
      whileHover: {
        y: -2,
        transition: { duration: 0.2 }
      },
      whileTap: clickable ? { scale: 0.98 } : undefined,
    } : {};

    const classes = cn([
      ...baseClasses,
      ...variantClasses[variant],
      paddingClasses[padding],
      (hoverable || clickable) && 'cursor-pointer',
      className,
    ]);

    return (
      <motion.div
        ref={ref}
        className={classes}
        {...hoverEffects}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header component
 */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Title component
 */
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-slate-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

/**
 * Card Description component
 */
export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-slate-600 leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

/**
 * Card Content component
 */
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

/**
 * Card Footer component
 */
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

/**
 * Card Image component with optimized loading
 */
interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
}

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, src, alt, aspectRatio = 'video', ...props }, ref) => {
    const aspectClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[21/9]',
      tall: 'aspect-[3/4]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden bg-slate-100',
          aspectClasses[aspectRatio],
          className
        )}
        {...props}
      >
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

export { Card };