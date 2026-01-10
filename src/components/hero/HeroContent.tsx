// src/components/hero/HeroContent.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Mouse } from 'lucide-react';

export default function HeroContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-center px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Badge (Переведенный текст) */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-medium text-white/90 uppercase tracking-wider backdrop-blur-md bg-white/10 border border-white/20">
            Профессиональный уход за садом
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl md:text-7xl text-white font-bold mb-6 leading-tight"
        >
          Искусство живого сада
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-lg md:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed"
        >
          Комплексный уход, лечение деревьев и эстетическая стрижка.
        </motion.p>

        {/* CTA Button */}
        <motion.a
          href="/contact"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-medium text-lg transition-colors hover:bg-white/20"
        >
          Обсудить проект
        </motion.a>
      </motion.div>

      {/* Scroll Indicator (Без текста, только иконка) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Mouse size={24} />
        </motion.div>
      </motion.div>
    </div>
  );
}
