import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroContent() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto text-center text-white relative z-10 px-4"
    >
      <motion.h1 
        variants={item}
        className="text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight mb-6"
      >
        Искусство <br />
        <span className="italic">создавать сады</span>
      </motion.h1>
      
      <motion.p 
        variants={item}
        className="text-lg md:text-xl font-sans font-light text-white/90 max-w-2xl mx-auto mb-10"
      >
        Мы проектируем пространства, где природа встречается с архитектурой, создавая гармонию для вашей жизни.
      </motion.p>
      
      <motion.div 
        variants={item}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a 
          href="/projects" 
          className="bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-stone-100 transition-colors w-full sm:w-auto flex items-center justify-center gap-2 group"
        >
          Смотреть проекты
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
        <a 
          href="/contact" 
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-colors w-full sm:w-auto"
        >
          Обсудить идею
        </a>
      </motion.div>
    </motion.div>
  );
}
