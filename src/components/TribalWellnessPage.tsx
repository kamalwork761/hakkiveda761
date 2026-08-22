import React from 'react';
import { CategoryPageTemplate } from './CategoryPageTemplate';

interface TribalWellnessPageProps {
  onNavigateHome: () => void;
}

export const TribalWellnessPage: React.FC<TribalWellnessPageProps> = ({ onNavigateHome }) => {
  return <CategoryPageTemplate categoryId="tribal-wellness" onNavigateHome={onNavigateHome} />;
};
