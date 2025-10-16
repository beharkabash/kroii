'use client';

import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import CarInquiryChat from './CarInquiryChat';
import { cn } from '@/app/lib/core/utils';

interface CarInquiryModalProps {
  car: {
    id: string;
    name: string;
    brand: string;
    model: string;
    year: number;
    price: string;
    slug: string;
  };
  trigger?: React.ReactNode;
  className?: string;
}

export default function CarInquiryModal({ car, trigger, className }: CarInquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <button className={cn(
      "flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors",
      className
    )}>
      <MessageCircle className="h-5 w-5" />
      <span>Kysy autosta</span>
    </button>
  );

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || defaultTrigger}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <CarInquiryChat car={car} />
          </div>
        </div>
      )}
    </>
  );
}