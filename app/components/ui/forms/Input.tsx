'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/app/lib/core/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'outline',
    inputSize = 'md',
    fullWidth = true,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    const hasError = !!error;
    const hasSuccess = !!success;

    const baseClasses = [
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-slate-400',
    ];

    const variantClasses = {
      default: [
        'border-0 border-b-2 bg-transparent',
        'border-slate-300 focus:border-purple-500',
        hasError && 'border-red-500 focus:border-red-500',
        hasSuccess && 'border-green-500 focus:border-green-500',
      ],
      filled: [
        'border-0 bg-slate-100',
        'focus:bg-white focus:ring-purple-500',
        hasError && 'bg-red-50 focus:ring-red-500',
        hasSuccess && 'bg-green-50 focus:ring-green-500',
      ],
      outline: [
        'border-2 bg-white',
        'border-slate-300 focus:border-purple-500 focus:ring-purple-500',
        hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
        hasSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500',
      ],
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-3 text-base rounded-lg',
      lg: 'px-5 py-4 text-lg rounded-lg',
    };

    const inputClasses = cn([
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[inputSize],
      leftIcon && (inputSize === 'sm' ? 'pl-9' : inputSize === 'md' ? 'pl-11' : 'pl-12'),
      (rightIcon || isPassword) && (inputSize === 'sm' ? 'pr-9' : inputSize === 'md' ? 'pr-11' : 'pr-12'),
      fullWidth && 'w-full',
      className,
    ]);

    const iconSize = inputSize === 'sm' ? 'h-4 w-4' : inputSize === 'md' ? 'h-5 w-5' : 'h-6 w-6';

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'block text-sm font-medium transition-colors',
              hasError ? 'text-red-700' :
              hasSuccess ? 'text-green-700' :
              isFocused ? 'text-purple-700' : 'text-slate-700'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className={cn(
              'absolute left-0 top-0 h-full flex items-center justify-center text-slate-400',
              inputSize === 'sm' ? 'w-8' : inputSize === 'md' ? 'w-10' : 'w-12'
            )}>
              <span className={iconSize}>{leftIcon}</span>
            </div>
          )}

          <motion.input
            ref={ref}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            whileFocus={{ scale: 1.01 }}
            {...props}
          />

          {(rightIcon || isPassword) && (
            <div className={cn(
              'absolute right-0 top-0 h-full flex items-center justify-center',
              inputSize === 'sm' ? 'w-8' : inputSize === 'md' ? 'w-10' : 'w-12'
            )}>
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className={iconSize} />
                  ) : (
                    <Eye className={iconSize} />
                  )}
                </button>
              ) : rightIcon ? (
                <span className={cn('text-slate-400', iconSize)}>{rightIcon}</span>
              ) : null}
            </div>
          )}

          {hasError && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}

          {hasSuccess && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>

        {(error || success || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p className="text-sm text-slate-500">{helperText}</p>
            )}
          </motion.div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };