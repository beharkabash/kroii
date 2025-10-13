'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, Calendar, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  slug: string;
}

interface Testimonial {
  id: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  content: string;
  location?: string;
  purchaseDate?: string;
  createdAt: string;
  vehicles?: Vehicle;
}

interface TestimonialsProps {
  vehicleId?: string;
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export default function Testimonials({
  vehicleId,
  limit = 6,
  showTitle = true,
  className = ''
}: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchTestimonials = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (vehicleId) params.set('vehicleId', vehicleId);
      params.set('limit', limit.toString());

      const response = await fetch(`/api/testimonials?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setTestimonials(result.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId, limit]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  // For vehicle-specific testimonials or when we have few testimonials, show grid
  const showCarousel = testimonials.length > 3 && !vehicleId;

  return (
    <section className={`py-16 bg-slate-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {vehicleId ? 'Asiakkaiden kokemuksia tästä autosta' : 'Mitä asiakkaamme sanovat'}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Lue mitä tyytyväiset asiakkaamme kertovat kokemuksistaan kanssamme
            </p>
          </motion.div>
        )}

        {showCarousel ? (
          // Carousel for homepage
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </motion.div>
            </div>

            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-600 p-3 rounded-full shadow-lg transition z-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-600 p-3 rounded-full shadow-lg transition z-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="flex justify-center mt-6 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 w-2 rounded-full transition ${
                        index === currentSlide ? 'bg-purple-600' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          // Grid layout for vehicle-specific or fewer testimonials
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        )}

        {!vehicleId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/testimonials"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Lue lisää arvosteluja
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < testimonial.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
        <Quote className="h-6 w-6 text-purple-300" />
      </div>

      {testimonial.title && (
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {testimonial.title}
        </h3>
      )}

      <p className="text-slate-700 flex-grow mb-4 leading-relaxed">
        &quot;{testimonial.content}&quot;
      </p>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{testimonial.customerName}</p>
            {testimonial.location && (
              <div className="flex items-center text-sm text-slate-500">
                <MapPin className="h-3 w-3 mr-1" />
                {testimonial.location}
              </div>
            )}
          </div>
        </div>

        {testimonial.vehicles && (
          <div className="text-sm text-slate-600 mb-2">
            <Link
              href={`/cars/${testimonial.vehicles.slug}`}
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              {testimonial.vehicles.make} {testimonial.vehicles.model} ({testimonial.vehicles.year})
            </Link>
          </div>
        )}

        {testimonial.purchaseDate && (
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="h-3 w-3 mr-1" />
            Ostettu {formatDate(testimonial.purchaseDate)}
          </div>
        )}
      </div>
    </div>
  );
}