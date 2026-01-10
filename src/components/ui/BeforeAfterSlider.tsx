import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { clsx } from 'clsx';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, alt }: BeforeAfterSliderProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(50);
  
  // 1. ДОБАВЛЕНО: Объявление переменной состояния
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = clientX - left;
    const newPos = Math.max(0, Math.min(100, (x / width) * 100));
    setPosition(newPos);
    
    // 2. ДОБАВЛЕНО: Фиксация того, что пользователь трогал слайдер
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]); // Добавили зависимость

  const handleMouseDown = () => setIsResizing(true);
  const handleTouchStart = () => setIsResizing(true);

  useEffect(() => {
    const handleMouseUp = () => setIsResizing(false);
    const handleTouchEnd = () => setIsResizing(false);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isResizing) handleMove(e.touches[0].clientX);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isResizing, handleMove]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize group"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* After Image (Background) */}
      <img 
        src={afterImage} 
        alt={`After: ${alt}`} 
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      
      {/* Before Image (Foreground with Clip Path) */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img 
          src={beforeImage} 
          alt={`Before: ${alt}`} 
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-primary transition-transform group-active:scale-110">
          <ChevronsLeftRight size={20} />
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-6 left-6 z-10 glass-panel px-3 py-1 rounded-full text-sm font-medium text-primary shadow-glow">
        До
      </div>
      <div className="absolute top-6 right-6 z-10 glass-panel px-3 py-1 rounded-full text-sm font-medium text-primary shadow-glow">
        После
      </div>

      {/* Drag Hint */}
      {/* Теперь эта переменная существует и ошибки не будет */}
      {!hasInteracted && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12 z-20 pointer-events-none transition-opacity duration-500 opacity-70 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
          Потяните слайдер
        </div>
      )}
    </div>
  );
}
