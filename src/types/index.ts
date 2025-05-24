export interface PsychologicalConcept {
  id: string;
  name: string;
  basicDescription: string;
  complexDescription: string;
  price: number; // Price in Psi
  category: string; // e.g., 'CBT', 'General Psychology'
  iconName?: string; // Optional icon name (corresponds to keys in conceptIcons)
  icon?: React.ElementType; // Kept for potential direct component usage, but iconName is preferred for JSON
}
