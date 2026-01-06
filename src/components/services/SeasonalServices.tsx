import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IconResolver from '../ui/IconResolver';
import { clsx } from 'clsx';
import { ArrowRight } from 'lucide-react';

interface Service {
  title: string;
  icon?: string;
  description: string;
  seasons: string[]; // 'spring', 'summer', 'autumn', 'winter'
  link: string;
}

interface SeasonalServicesProps {
  services: Service[];
}

const SEASONS = [
  { id: 'all', label: 'Все сезоны' },
  { id: 'spring', label: 'Весна' },
  { id: 'summer', label: 'Лето' },
  { id: 'autumn', label: 'Осень' },
  { id: 'winter', label: 'Зима' },
];

export default function SeasonalServices({ services }: SeasonalServicesProps) {
  // Determine current season initially? For now default to 'all' as requested or logic.
  // Let's default to 'all' for better UX discovery.
  const [activeSeason, setActiveSeason] = useState('all');

  const filteredServices = useMemo(() => {
    if (activeSeason === 'all') return services;
    return services.filter(service => service.seasons.includes(activeSeason));
  }, [services, activeSeason]);

  return (
    <div className="w-full">
      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar md:justify-center px-4">
        {SEASONS.map((season) => (
          <button
            key={season.id}
            onClick={() => setActiveSeason(season.id)}
            className={clsx(
              'px-6 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm md:text-base',
              activeSeason === season.id
                ? 'bg-primary text-white shadow-lg scale-105'
                : 'bg-white text-primary/70 hover:bg-stone-100 hover:text-primary'
            )}
          >
            {season.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service) => (
            <motion.div
              layout
              key={service.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full"
            >
              <div className="w-14 h-14 bg-[#1a4031]/5 rounded-2xl flex items-center justify-center mb-4 text-primary">
                 <IconResolver name={service.icon || ''} className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-xl font-serif font-semibold text-primary mb-3">
                {service.title}
              </h3>
              
              <p className="text-stone-600 mb-6 flex-grow text-sm leading-relaxed">
                {service.description}
              </p>
              
              <a 
                href={service.link}
                className="inline-flex items-center text-accent font-medium group-hover:gap-2 transition-all"
              >
                Подробнее <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          В этом сезоне услуги пока не добавлены.
        </div>
      )}
    </div>
  );
}
