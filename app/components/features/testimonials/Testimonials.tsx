'use client';

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User, Calendar, MapPin, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
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

interface TouchPosition {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

// Mock Finnish testimonials data for demonstration
const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    customerName: 'Matti Virtanen',
    rating: 5,
    title: 'Erinomainen palvelu ja laatu',
    content: 'Ostin BMW X3:n Kroi Auto Centeristä ja olen erittäin tyytyväinen sekä autoon että palveluun. Myyjä oli asiantunteva ja auttoi löytämään juuri minulle sopivan auton. Kaupanteko sujui vaivattomasti ja auto oli täydellisessä kunnossa.',
    location: 'Helsinki',
    purchaseDate: '2024-09-15',
    createdAt: '2024-09-16',
    vehicles: {
      id: 'bmw-x3-2022',
      make: 'BMW',
      model: 'X3',
      year: 2022,
      slug: 'bmw-x3-2022'
    }
  },
  {
    id: '2',
    customerName: 'Anna Korhonen',
    rating: 5,
    title: 'Unelma-auto löytyi täältä',
    content: 'Olin etsinyt Mercedes C-sarjaa pitkään ja löysin täydellisen auton Kroi Auto Centeristä. Henkilökunta oli ystävällistä ja ammattimaista. Rahoitus järjestyi helposti ja sain hyvän vaihtoarvioin vanhalle autolleni.',
    location: 'Espoo',
    purchaseDate: '2024-08-22',
    createdAt: '2024-08-23',
    vehicles: {
      id: 'mercedes-c-class-2023',
      make: 'Mercedes-Benz',
      model: 'C-sarja',
      year: 2023,
      slug: 'mercedes-c-class-2023'
    }
  },
  {
    id: '3',
    customerName: 'Jukka Nieminen',
    rating: 5,
    title: 'Luotettava kumppani autokaupassa',
    content: 'Tämä oli jo toinen autoni Kroi Auto Centeristä. Palvelu on aina ollut moitteetonta ja autot laadukkaita. Audi A4 Avant on täydellinen perheen tarpeisiin ja kaikki lupaukset on pidetty.',
    location: 'Vantaa',
    purchaseDate: '2024-07-10',
    createdAt: '2024-07-11',
    vehicles: {
      id: 'audi-a4-avant-2022',
      make: 'Audi',
      model: 'A4 Avant',
      year: 2022,
      slug: 'audi-a4-avant-2022'
    }
  },
  {
    id: '4',
    customerName: 'Laura Mäkelä',
    rating: 5,
    title: 'Ensimmäinen autoni - loistava kokemus',
    content: 'Ostin ensimmäisen autoni Kroi Auto Centeristä. Henkilökunta kävi läpi kaikki yksityiskohdat kärsivällisesti ja auttoi valitsemaan sopivan auton. Volkswagen Golf on ollut täydellinen valinta nuorelle kuljettajalle.',
    location: 'Tampere',
    purchaseDate: '2024-06-18',
    createdAt: '2024-06-19',
    vehicles: {
      id: 'volkswagen-golf-2021',
      make: 'Volkswagen',
      model: 'Golf',
      year: 2021,
      slug: 'volkswagen-golf-2021'
    }
  },
  {
    id: '5',
    customerName: 'Petri Salminen',
    rating: 5,
    title: 'Yritykselle täydellinen ratkaisu',
    content: 'Hankimme yrityksemme tarpeisiin Ford Transit Custom -pakettiauton. Kroi Auto Center tarjosi kilpailukykyisen hinnan ja erinomaisen asiakaspalvelun. Leasingsopimus järjestyi nopeasti ja vaivattomasti.',
    location: 'Turku',
    purchaseDate: '2024-05-25',
    createdAt: '2024-05-26',
    vehicles: {
      id: 'ford-transit-custom-2023',
      make: 'Ford',
      model: 'Transit Custom',
      year: 2023,
      slug: 'ford-transit-custom-2023'
    }
  },
  {
    id: '6',
    customerName: 'Sari Heikkinen',
    rating: 5,
    title: 'Upea SUV perheelle',
    content: 'Toyota RAV4 Hybrid on ollut täydellinen valinta perheen tarpeisiin. Polttoaineen kulutus on alhaisempi kuin odotimme ja auto on erittäin toimintavarma. Kroi Auto Centerin jälkipalvelu on myös kiitettävää.',
    location: 'Jyväskylä',
    purchaseDate: '2024-04-12',
    createdAt: '2024-04-13',
    vehicles: {
      id: 'toyota-rav4-hybrid-2022',
      make: 'Toyota',
      model: 'RAV4 Hybrid',
      year: 2022,
      slug: 'toyota-rav4-hybrid-2022'
    }
  }
];

// Hook for touch/swipe functionality
const useSwipe = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const touchRef = useRef<TouchPosition | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;

    const touch = e.touches[0];
    touchRef.current.currentX = touch.clientX;
    touchRef.current.currentY = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchRef.current) return;

    const { startX, startY, currentX, currentY } = touchRef.current;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const minSwipeDistance = 50;

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }

    touchRef.current = null;
  }, [onSwipeLeft, onSwipeRight]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

// Hook for intersection observer (performance optimization)
const useIntersectionObserver = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isIntersecting };
};

export default function Testimonials({
  vehicleId,
  limit = 6,
  showTitle = true,
  className = ''
}: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { ref: sectionRef, isIntersecting } = useIntersectionObserver();

  // Memoize filtered testimonials
  const filteredTestimonials = useMemo(() => {
    return vehicleId
      ? MOCK_TESTIMONIALS.filter(t => t.vehicles?.id === vehicleId).slice(0, limit)
      : MOCK_TESTIMONIALS.slice(0, limit);
  }, [vehicleId, limit]);

  const fetchTestimonials = useCallback(async () => {
    try {
      // Simulate API call with mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTestimonials(filteredTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fallback to mock data
      setTestimonials(filteredTestimonials);
    } finally {
      setLoading(false);
    }
  }, [filteredTestimonials]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  }, [testimonials.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isPaused && testimonials.length > 1 && isIntersecting) {
      autoPlayIntervalRef.current = setInterval(nextSlide, 5000);
    } else if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, isPaused, testimonials.length, nextSlide, isIntersecting]);

  // Touch/swipe handlers
  const swipeHandlers = useSwipe(nextSlide, prevSlide);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPaused(prev => !prev);
    }
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  if (loading) {
    return <TestimonialsLoadingSkeleton className={className} showTitle={showTitle} />;
  }

  if (testimonials.length === 0) {
    return null;
  }

  // For vehicle-specific testimonials or when we have few testimonials, show grid
  const showCarousel = testimonials.length > 3 && !vehicleId;

  return (
    <section
      ref={sectionRef}
      className={`py-16 bg-slate-50 ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Asiakasarvostelut"
    >
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
          // Enhanced Carousel for homepage
          <div className="relative">
            <div
              className="overflow-hidden rounded-2xl"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              {...swipeHandlers}
            >
              <motion.div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                  if (info.offset.x > 100) {
                    prevSlide();
                  } else if (info.offset.x < -100) {
                    nextSlide();
                  }
                }}
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
                <motion.button
                  onClick={prevSlide}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-600 p-3 rounded-full shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label="Edellinen arvostelu"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>

                <motion.button
                  onClick={nextSlide}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-600 p-3 rounded-full shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label="Seuraava arvostelu"
                >
                  <ChevronRight className="h-5 w-5" />
                </motion.button>

                {/* Auto-play control */}
                <motion.button
                  onClick={() => setIsAutoPlaying(prev => !prev)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-slate-600 p-2 rounded-full shadow-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label={isAutoPlaying ? 'Pysäytä automaattinen toisto' : 'Käynnistä automaattinen toisto'}
                >
                  {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </motion.button>

                {/* Enhanced indicators */}
                <div className="flex justify-center mt-6 space-x-2" role="tablist" aria-label="Arvostelun valinta">
                  {testimonials.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => goToSlide(index)}
                      whileHover={{ scale: 1.2 }}
                      className={`h-3 w-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                        index === currentSlide
                          ? 'bg-purple-600 scale-110'
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                      role="tab"
                      aria-selected={index === currentSlide}
                      aria-label={`Siirry arvosteluun ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Progress indicator */}
                {isAutoPlaying && !isPaused && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 overflow-hidden">
                    <motion.div
                      className="h-full bg-purple-600"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // Enhanced Grid layout for vehicle-specific or fewer testimonials
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
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Lue lisää arvosteluja
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Memoized TestimonialCard component for performance
const TestimonialCard = memo(({ testimonial }: { testimonial: Testimonial }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col group"
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ duration: 0.2 }}
      role="article"
      aria-labelledby={`testimonial-title-${testimonial.id}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1" role="img" aria-label={`${testimonial.rating} tähteä 5:stä`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Star
                  className={`h-4 w-4 transition-colors duration-200 ${
                    index < testimonial.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-slate-300'
                  }`}
                />
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Quote className="h-6 w-6 text-purple-300 group-hover:text-purple-400 transition-colors duration-200" />
        </motion.div>
      </div>

      {testimonial.title && (
        <h3
          id={`testimonial-title-${testimonial.id}`}
          className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-purple-700 transition-colors duration-200"
        >
          {testimonial.title}
        </h3>
      )}

      <p className="text-slate-700 flex-grow mb-4 leading-relaxed group-hover:text-slate-800 transition-colors duration-200">
        &quot;{testimonial.content}&quot;
      </p>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center space-x-3 mb-2">
          <motion.div
            className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <User className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <p className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors duration-200">
              {testimonial.customerName}
            </p>
            {testimonial.location && (
              <div className="flex items-center text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-200">
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
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
            >
              {testimonial.vehicles.make} {testimonial.vehicles.model} ({testimonial.vehicles.year})
            </Link>
          </div>
        )}

        {testimonial.purchaseDate && (
          <div className="flex items-center text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-200">
            <Calendar className="h-3 w-3 mr-1" />
            Ostettu {formatDate(testimonial.purchaseDate)}
          </div>
        )}
      </div>
    </motion.div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

// Loading skeleton component
const TestimonialsLoadingSkeleton = ({ className = '', showTitle = true }: { className?: string; showTitle?: boolean }) => {
  return (
    <section className={`py-16 bg-slate-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <div className="h-10 bg-slate-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-80 mx-auto animate-pulse"></div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
              {/* Rating and quote skeleton */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <div key={starIndex} className="h-4 w-4 bg-slate-200 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-6 w-6 bg-slate-200 rounded animate-pulse"></div>
              </div>

              {/* Title skeleton */}
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2 animate-pulse"></div>

              {/* Content skeleton */}
              <div className="flex-grow mb-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5 animate-pulse"></div>
              </div>

              {/* Footer skeleton */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="flex-grow">
                    <div className="h-4 bg-slate-200 rounded w-24 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-3 bg-slate-200 rounded w-28 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};