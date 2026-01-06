import React from 'react';
import { 
  Trees, 
  Sprout, 
  Shovel, 
  Scissors, 
  Flower, 
  Sun, 
  Cloud, 
  Snowflake, 
  Check, 
  X, 
  HelpCircle 
} from 'lucide-react';

interface IconResolverProps {
  name: string;
  className?: string;
}

const ICONS: Record<string, React.ElementType> = {
  trees: Trees,
  sprout: Sprout,
  shovel: Shovel,
  scissors: Scissors,
  flower: Flower,
  sun: Sun,
  cloud: Cloud,
  snowflake: Snowflake,
  check: Check,
  x: X,
  helpcircle: HelpCircle,
};

export default function IconResolver({ name, className }: IconResolverProps) {
  // Normalize the name to lowercase for case-insensitive matching
  const normalizedName = name?.toLowerCase() || '';
  const IconComponent = ICONS[normalizedName] || Sprout; // Default to Sprout

  return <IconComponent className={className} />;
}
