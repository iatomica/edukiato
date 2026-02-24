import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { View } from '../types';

interface TourContextType {
  isOpen: boolean;
  currentStep: number;
  activeView: View | null;
  startTour: (view: View) => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  hasSeenTour: (view: View) => boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeView, setActiveView] = useState<View | null>(null);
  const [seenTours, setSeenTours] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem('edukiato_tours_seen');
    if (stored) {
      try {
        setSeenTours(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse tour history", e);
      }
    }
  }, []);

  const hasSeenTour = useCallback((view: View) => {
    return !!seenTours[view];
  }, [seenTours]);

  const startTour = useCallback((view: View) => {
    setActiveView(view);
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const endTour = useCallback(() => {
    if (activeView) {
      // Use functional update for state to ensure we have latest, though seenTours is in dependency
      setSeenTours(prev => {
        const updated = { ...prev, [activeView]: true };
        localStorage.setItem('edukiato_tours_seen', JSON.stringify(updated));
        return updated;
      });
    }
    setIsOpen(false);
    setActiveView(null);
  }, [activeView]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  return (
    <TourContext.Provider value={{ isOpen, currentStep, activeView, startTour, endTour, nextStep, prevStep, hasSeenTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};