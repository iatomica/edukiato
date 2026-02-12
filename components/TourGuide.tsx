import React, { useEffect, useState, useRef } from 'react';
import { useTour } from '../contexts/TourContext';
import { useLanguage, TourStep } from '../contexts/LanguageContext';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { View } from '../types';

export const TourGuide: React.FC = () => {
  const { isOpen, currentStep, nextStep, prevStep, endTour, activeView } = useTour();
  const { t } = useLanguage();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{top: number, left: number}>({ top: 0, left: 0 });

  // Get steps for the current view, or default if not defined
  const steps: TourStep[] = activeView && t.tour[activeView as keyof typeof t.tour] 
    ? t.tour[activeView as keyof typeof t.tour] as TourStep[]
    : t.tour.default as TourStep[];

  const currentTourStep = steps[currentStep];

  useEffect(() => {
    if (!isOpen || !currentTourStep) return;

    const updatePosition = () => {
      if (currentTourStep.target) {
        const element = document.getElementById(currentTourStep.target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
          
          // Calculate Tooltip Position
          // Simple logic: Place near the target based on preferred position or available space
          let top = rect.bottom + 12;
          let left = rect.left;

          // Adjust for screen edges (simple safeguard)
          if (left + 320 > window.innerWidth) { // 320 is approx card width
            left = window.innerWidth - 340;
          }
          if (top + 200 > window.innerHeight) {
             top = rect.top - 220; // Flip to top if no space below
          }

          setTooltipPos({ top, left });
        } else {
          // Element not found, fallback to center
          setTargetRect(null);
        }
      } else {
        // No target defined, center modal
        setTargetRect(null);
      }
    };

    // Small delay to allow DOM to render/transition before calculating
    const timeout = setTimeout(updatePosition, 300);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, currentStep, currentTourStep]);

  if (!isOpen || !currentTourStep) return null;

  const isLastStep = currentStep === steps.length - 1;

  // Render centered modal if no target or target not found
  if (!currentTourStep.target || !targetRect) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={endTour} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20 animate-scale-in">
           {/* Decorative */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
           
           <div className="relative z-10">
             <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{currentStep + 1} / {steps.length}</span>
                <button onClick={endTour} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
             </div>
             <h3 className="text-2xl font-bold text-slate-800 mb-2">{currentTourStep.title}</h3>
             <p className="text-slate-600 mb-8 leading-relaxed">{currentTourStep.content}</p>
             
             <div className="flex justify-between items-center">
               <button onClick={endTour} className="text-sm font-medium text-slate-400 hover:text-slate-600">{t.tour.skip}</button>
               <div className="flex gap-3">
                 {currentStep > 0 && (
                   <button onClick={prevStep} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">{t.tour.prev}</button>
                 )}
                 <button onClick={nextStep} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center">
                   {t.tour.next} <ArrowRight size={16} className="ml-2" />
                 </button>
               </div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Render Spotlight Mode
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Spotlight Overlay: We use a div with a massive box-shadow to "cut out" the hole */}
      <div 
        className="absolute transition-all duration-300 ease-in-out pointer-events-none"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
          borderRadius: '12px',
          boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.75)', // Slate-900 with opacity
          zIndex: 100
        }}
      />
      
      {/* Tooltip Card */}
      <div 
        className="absolute z-[101] transition-all duration-300 ease-out"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl p-6 w-80 animate-fade-in-up border border-slate-200">
          <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wide">Step {currentStep + 1}</span>
             <button onClick={endTour} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
          </div>
          <h4 className="font-bold text-slate-900 text-lg mb-2">{currentTourStep.title}</h4>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">{currentTourStep.content}</p>
          
          <div className="flex justify-between items-center">
             {currentStep > 0 ? (
               <button onClick={prevStep} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full"><ArrowLeft size={18} /></button>
             ) : <div></div>}
             
             <button 
               onClick={isLastStep ? endTour : nextStep} 
               className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-md hover:bg-slate-800 flex items-center"
             >
               {isLastStep ? t.tour.finish : t.tour.next}
               {!isLastStep && <ArrowRight size={14} className="ml-2" />}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};