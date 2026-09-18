import React from 'react';
import { useStore } from '../context/StoreContext';
import { HairAnalysisPage } from './HairAnalysis/HairAnalysisPage';

export const AIHairQuiz: React.FC = () => {
  const { isQuizOpen, setIsQuizOpen } = useStore();

  if (!isQuizOpen) return null;

  return (
    <HairAnalysisPage
      isModal={true}
      onCloseModal={() => setIsQuizOpen(false)}
      onReturnHome={() => setIsQuizOpen(false)}
    />
  );
};
