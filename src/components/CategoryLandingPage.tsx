import React, { Suspense, lazy } from 'react';
import { CategoryPageTemplate } from './CategoryPageTemplate';

interface CategoryLandingPageProps {
  categoryPath: string;
  onReturnHome: () => void;
}

const CategorySkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#FAF8F2] dark:bg-[#0E281C] text-[#123F2A] dark:text-white flex items-center justify-center p-8 transition-colors duration-300">
    <div className="bg-white dark:bg-[#123F2B] border border-[#E5D8B5] dark:border-white/10 rounded-2xl p-8 max-w-md w-full text-center space-y-4 animate-pulse shadow-sm">
      <div className="w-12 h-12 bg-[#C9A84E]/20 rounded-full mx-auto" />
      <div className="h-6 bg-[#123F2A]/10 dark:bg-white/10 rounded-lg w-3/4 mx-auto" />
      <div className="h-4 bg-[#123F2A]/10 dark:bg-white/10 rounded-lg w-1/2 mx-auto" />
    </div>
  </div>
);

export const CategoryLandingPage: React.FC<CategoryLandingPageProps> = ({ categoryPath, onReturnHome }) => {
  const cleanId = categoryPath.replace(/^\//, '').replace(/^categories\//, '') || 'hair-care';

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryPageTemplate categoryId={cleanId} onNavigateHome={onReturnHome} />
    </Suspense>
  );
};
