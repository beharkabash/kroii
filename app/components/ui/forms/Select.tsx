'use client';

import { forwardRef, SelectHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/app/lib/core/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  placeholder?: string;
  options: SelectOption[];
  selectSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  customSelect?: boolean; // Use custom dropdown instead of native select
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    label,
    error,
    success,
    helperText,
    placeholder = 'Valitse vaihtoehto...',
    options,
    selectSize = 'md',
    fullWidth = true,
    customSelect = true,
    disabled,
    value,
    onChange,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
      options.find(opt => opt.value === value) || null
    );

    const hasError = !!error;
    const hasSuccess = !!success;

    const baseClasses = [
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'bg-white border-2',
    ];

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-3 text-base rounded-lg',
      lg: 'px-5 py-4 text-lg rounded-lg',
    };

    const selectClasses = cn([
      ...baseClasses,
      sizeClasses[selectSize],
      'border-slate-300 focus:border-purple-500 focus:ring-purple-500',
      hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500',
      hasSuccess && 'border-green-500 focus:border-green-500 focus:ring-green-500',
      'appearance-none cursor-pointer',
      fullWidth && 'w-full',
      className,
    ]);

    const handleOptionSelect = (option: SelectOption) => {
      setSelectedOption(option);
      setIsOpen(false);

      if (onChange) {
        const event = {
          target: { value: option.value }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
    };

    if (!customSelect) {
      // Native select fallback
      return (
        <div className={cn('space-y-2', fullWidth && 'w-full')}>
          {label && (
            <label className={cn(
              'block text-sm font-medium',
              hasError ? 'text-red-700' :
              hasSuccess ? 'text-green-700' : 'text-slate-700'
            )}>
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          <div className="relative">
            <select
              ref={ref}
              className={cn(selectClasses, 'pr-10')}
              disabled={disabled}
              value={value}
              onChange={onChange}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="h-5 w-5 text-slate-400" />
            </div>
          </div>

          {(error || success || helperText) && (
            <div className="space-y-1">
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
            </div>
          )}
        </div>
      );
    }

    // Custom select with animations
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'block text-sm font-medium transition-colors',
              hasError ? 'text-red-700' :
              hasSuccess ? 'text-green-700' : 'text-slate-700'
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}

        <div className="relative">
          <motion.button
            type="button"
            className={cn(
              selectClasses,
              'flex items-center justify-between w-full text-left',
              !selectedOption && 'text-slate-400'
            )}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            whileFocus={{ scale: 1.01 }}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-slate-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute top-full left-0 right-0 z-50 mt-1',
                  'bg-white border-2 border-slate-200 rounded-lg shadow-lg',
                  'max-h-60 overflow-y-auto'
                )}
              >
                {options.map((option, index) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    className={cn(
                      'w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors',
                      'flex items-center justify-between',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'first:rounded-t-md last:rounded-b-md',
                      selectedOption?.value === option.value && 'bg-purple-50 text-purple-600'
                    )}
                    disabled={option.disabled}
                    onClick={() => handleOptionSelect(option)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="truncate">{option.label}</span>
                    {selectedOption?.value === option.value && (
                      <Check className="h-4 w-4 text-purple-600" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {hasError && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}

          {hasSuccess && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          )}

          {/* Hidden native select for form submission */}
          <select
            ref={ref}
            className="sr-only"
            value={selectedOption?.value || ''}
            onChange={() => {}} // Handled by custom logic
            tabIndex={-1}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

        {/* Overlay to close dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };