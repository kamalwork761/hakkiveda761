import React from 'react';
import { CategoryPageTemplate } from './CategoryPageTemplate';

interface HairCarePageProps {
  onNavigateHome: () => void;
}

export const HairCarePage: React.FC<HairCarePageProps> = ({ onNavigateHome }) => {
  return <CategoryPageTemplate categoryId="hair-care" onNavigateHome={onNavigateHome} />;
};
