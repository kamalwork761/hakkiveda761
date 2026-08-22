import React from 'react';
import { CategoryPageTemplate } from './CategoryPageTemplate';

interface SkinCarePageProps {
  onNavigateHome: () => void;
}

export const SkinCarePage: React.FC<SkinCarePageProps> = ({ onNavigateHome }) => {
  return <CategoryPageTemplate categoryId="skin-care" onNavigateHome={onNavigateHome} />;
};
