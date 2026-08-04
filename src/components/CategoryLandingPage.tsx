import React, { Suspense, lazy } from 'react';

const HairCarePage = lazy(() => import('./HairCarePage').then((m) => ({ default: m.HairCarePage })));
const SkinCarePage = lazy(() => import('./SkinCarePage').then((m) => ({ default: m.SkinCarePage })));
const TribalWellnessPage = lazy(() => import('./TribalWellnessPage').then((m) => ({ default: m.TribalWellnessPage })));

interface CategoryLandingPageProps {
  categoryPath: string;
  onReturnHome: () => void;
}

const CategorySkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#0E281C] text-white flex items-center justify-center p-8">
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center space-y-4 animate-pulse">
      <div className="w-12 h-12 bg-white/10 rounded-full mx-auto" />
      <div className="h-6 bg-white/10 rounded-lg w-3/4 mx-auto" />
      <div className="h-4 bg-white/10 rounded-lg w-1/2 mx-auto" />
    </div>
  </div>
);

export const CategoryLandingPage: React.FC<CategoryLandingPageProps> = ({ categoryPath, onReturnHome }) => {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      {categoryPath === '/hair-care' && <HairCarePage onNavigateHome={onReturnHome} />}
      {categoryPath === '/skin-care' && <SkinCarePage onNavigateHome={onReturnHome} />}
      {categoryPath === '/tribal-wellness' && <TribalWellnessPage onNavigateHome={onReturnHome} />}
    </Suspense>
  );
};
