import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  badge?: string;
  category?: string;
  link?: string;
  action?: {
    label: string;
    href: string;
  };
}

interface FeaturesCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({
  items,
  autoPlay = true,
  interval = 5000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slideAnimation = useSpring({
    transform: `translateX(-${currentIndex * 100}%)`,
    config: { tension: 100, friction: 14 },
  });

  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <animated.div 
        style={slideAnimation}
        className="flex transition-transform duration-500 ease-in-out"
      >
        {items.map((item) => (
          <div key={item.id} className="w-full flex-shrink-0">
            <div className="card h-full p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <div className="text-4xl">{item.icon}</div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {item.description}
              </p>
              
              {(item.action || item.link) && (
                <a 
                  href={item.action?.href || item.link}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {item.action?.label || 'Découvrir'}
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </a>
              )}
            </div>
          </div>
        ))}
      </animated.div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-primary-600' 
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};