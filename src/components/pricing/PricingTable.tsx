import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { clsx } from 'clsx';

interface PricingFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  type: string; // 'b2c' | 'b2b'
  description: string;
  isPopular: boolean;
  features: PricingFeature[];
}

interface PricingTableProps {
  plans: PricingPlan[];
}

export default function PricingTable({ plans }: PricingTableProps) {
  const [billing, setBilling] = useState<'b2c' | 'b2b'>('b2c');

  const filteredPlans = plans.filter((plan) => plan.type === billing);

  return (
    <div className="w-full">
      {/* Toggle */}
      <div className="flex justify-center mb-16">
        <div className="bg-stone-100 p-1 rounded-full flex relative">
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm z-0"
            animate={{
              x: billing === 'b2c' ? 0 : '100%',
              left: billing === 'b2c' ? 4 : 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setBilling('b2c')}
            className={clsx(
              "relative z-10 px-8 py-3 rounded-full font-medium transition-colors w-40 text-center",
              billing === 'b2c' ? 'text-primary' : 'text-stone-500 hover:text-primary'
            )}
          >
            Частным
          </button>
          <button
            onClick={() => setBilling('b2b')}
            className={clsx(
              "relative z-10 px-8 py-3 rounded-full font-medium transition-colors w-40 text-center",
              billing === 'b2b' ? 'text-primary' : 'text-stone-500 hover:text-primary'
            )}
          >
            Бизнесу
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <div
              key={plan.name}
              className={clsx(
                "rounded-3xl p-8 flex flex-col transition-all duration-300",
                plan.isPopular 
                  ? "bg-white border-2 border-accent shadow-glow scale-105 z-10 relative" 
                  : "bg-white border border-stone-100"
              )}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                  Популярный выбор
                </div>
              )}

              <h3 className="text-2xl font-serif text-primary font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-primary mb-4">{plan.price}</div>
              <p className="text-stone-500 mb-8 leading-relaxed">{plan.description}</p>

              <div className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-stone-300 shrink-0 mt-0.5" />
                    )}
                    <span className={clsx("text-sm", feature.included ? "text-stone-700" : "text-stone-400 line-through")}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={clsx(
                  "w-full py-4 rounded-xl font-medium transition-colors",
                  plan.isPopular
                    ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl"
                    : "border-2 border-stone-200 text-primary hover:border-primary hover:bg-white"
                )}
              >
                Выбрать тариф
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-stone-400">
            Для выбранной категории тарифы пока не добавлены.
          </div>
        )}
      </div>
    </div>
  );
}
