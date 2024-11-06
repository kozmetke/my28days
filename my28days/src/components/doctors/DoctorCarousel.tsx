'use client';

import { useState, useRef } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import DoctorCard from './DoctorCard';

interface Doctor {
  id: string;
  name: string;
  image: string;
  specialty: string;
  qualifications: string[];
  rating: number;
  yearsOfExperience: number;
}

interface DoctorCarouselProps {
  doctors: Doctor[];
}

export default function DoctorCarousel({ doctors }: DoctorCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate card width based on viewport
    const cardWidth = window.innerWidth < 640 
      ? container.offsetWidth // Full width on mobile
      : container.offsetWidth / 3; // 3 cards on desktop

    const newPosition = direction === 'left'
      ? Math.max(0, scrollPosition - cardWidth)
      : Math.min((doctors.length - (window.innerWidth < 640 ? 1 : 3)) * cardWidth, scrollPosition + cardWidth);

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  const showLeftButton = scrollPosition > 0;
  const showRightButton = containerRef.current 
    ? scrollPosition < (doctors.length - (window.innerWidth < 640 ? 1 : 3)) * (containerRef.current.offsetWidth / (window.innerWidth < 640 ? 1 : 3))
    : false;

  return (
    <div className="relative group">
      {/* Navigation Buttons - Hidden on mobile */}
      {showLeftButton && (
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <AiOutlineLeft className="w-5 h-5 text-neutral-600" />
        </button>
      )}

      {showRightButton && (
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <AiOutlineRight className="w-5 h-5 text-neutral-600" />
        </button>
      )}

      {/* Cards Container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {doctors.map(doctor => (
          <div
            key={doctor.id}
            className="flex-none w-full sm:w-1/3 snap-start"
          >
            <DoctorCard doctor={doctor} />
          </div>
        ))}
      </div>

      {/* Mobile Scroll Indicator */}
      <div className="flex justify-center mt-2 space-x-1 md:hidden">
        {doctors.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              Math.round(scrollPosition / containerRef.current?.offsetWidth!) === index
                ? 'w-4 bg-pink-500'
                : 'w-1 bg-neutral-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
