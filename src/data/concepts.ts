import type { PsychologicalConcept } from '@/types';
import { Brain, BookOpen, Zap, RefreshCcw, Smile, Users, Lightbulb, Target, Scale, Compass, Heart, Shield } from 'lucide-react';

// Keep initialPsiBalance if needed elsewhere, or move it if appropriate.
export const initialPsiBalance = 100; // Starting balance for the user

// Icons mapping can be kept here or moved if preferred
export const conceptIcons = {
    Brain, BookOpen, Zap, RefreshCcw, Smile, Users, Lightbulb, Target, Scale, Compass, Heart, Shield
};

// Example of how to potentially fetch or use icons dynamically if needed
export const getConceptIcon = (iconName: string | undefined): React.ElementType => {
  if (!iconName || !(iconName in conceptIcons)) {
    return Lightbulb; // Default icon
  }
  return conceptIcons[iconName as keyof typeof conceptIcons];
};
