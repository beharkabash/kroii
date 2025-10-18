'use client';

import { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/lib/core/utils';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  offset?: number;
  className?: string;
  contentClassName?: string;
  arrow?: boolean;
  maxWidth?: string;
}

const Tooltip = ({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  delay = 300,
  offset = 8,
  className,
  contentClassName,
  arrow = true,
  maxWidth = '200px',
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const toggleTooltip = () => {
    if (isVisible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + offset;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Keep tooltip within viewport
    if (x < 0) x = 8;
    if (x + tooltipRect.width > viewport.width) x = viewport.width - tooltipRect.width - 8;
    if (y < 0) y = 8;
    if (y + tooltipRect.height > viewport.height) y = viewport.height - tooltipRect.height - 8;

    setCoordinates({ x, y });
  }, [position, offset]);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        trigger === 'click' &&
        isVisible &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        hideTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, trigger]);

  const eventHandlers = {
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(trigger === 'click' && {
      onClick: toggleTooltip,
    }),
    ...(trigger === 'focus' && {
      onFocus: showTooltip,
      onBlur: hideTooltip,
    }),
  };

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-2 h-2 bg-slate-900 transform rotate-45';

    switch (position) {
      case 'top':
        return `${baseClasses} -bottom-1 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${baseClasses} -top-1 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${baseClasses} -right-1 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${baseClasses} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 300,
        duration: 0.15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('inline-block cursor-help', className)}
        {...eventHandlers}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <div
            className="fixed top-0 left-0 z-[9999] pointer-events-none"
            style={{
              transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
            }}
          >
            <motion.div
              ref={tooltipRef}
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'relative px-3 py-2 text-sm text-white bg-slate-900 rounded-lg shadow-lg',
                'border border-slate-700 backdrop-blur-sm',
                contentClassName
              )}
              style={{ maxWidth }}
            >
              {content}
              {arrow && <div className={getArrowClasses()} />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * Simple Tooltip with predefined styles for common use cases
 */
interface SimpleTooltipProps {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const SimpleTooltip = ({ text, children, position = 'top' }: SimpleTooltipProps) => (
  <Tooltip content={text} position={position}>
    {children}
  </Tooltip>
);

/**
 * Info Tooltip with info icon
 */
interface InfoTooltipProps {
  content: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InfoTooltip = ({ content, size = 'md', className }: InfoTooltipProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <Tooltip content={content} position="top" maxWidth="300px">
      <div className={cn(
        'inline-flex items-center justify-center rounded-full',
        'bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors',
        sizeClasses[size],
        className
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </div>
    </Tooltip>
  );
};

export { Tooltip };