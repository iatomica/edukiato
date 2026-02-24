
import React from 'react';
import { useAppState } from '../contexts/AppStateContext';
import { ONBOARDING_STEPS } from '../services/onboarding';
import { UserRole, View } from '../types';
import { CheckCircle, Circle, X, ArrowRight, Flag } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface OnboardingWidgetProps {
    role: UserRole;
    onViewChange: (view: View) => void;
}

export const OnboardingWidget: React.FC<OnboardingWidgetProps> = ({ role, onViewChange }) => {
    const { state, dispatch } = useAppState();
    const { onboarding } = state;
    const { t } = useLanguage();

    if (onboarding.isDismissed) return null;

    const steps = ONBOARDING_STEPS[role] || [];
    if (steps.length === 0) return null;

    const completedCount = steps.filter(step => onboarding.completedSteps.includes(step.id)).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    // Auto-dismiss if 100% complete? Optional. Users might want to see success state.

    const handleAction = (stepId: string, targetView: View) => {
        // Mark as complete when action is taken (simplified for MVP)
        // In a real app, completion would trigger based on actual data change (e.g., event listener)
        // Here we can optimistically mark it, or wait for the user to do the task.
        // For a "Quick Start" guide, clicking "Go" often implies starting the task.
        // Better: let the actual action completion update the state via event handlers.
        // But for this MVP widget, let's allow manual completion or just navigation.

        // Check if we should mark complete immediately? 
        // No, let's rely on eventHandlers or manual check.
        // Implemented hack: For this walkthrough, clicking the action completes the step for demo purposes if not strictly data-bound.
        // Actually, let's make it data-bound where possible.
        // "create_course" -> listened in eventHandler?
        // We haven't implemented that logic in eventHandlers yet.
        // So for now, we'll just navigate.

        onViewChange(targetView);
    };

    const handleDismiss = () => {
        dispatch({ type: 'DISMISS_ONBOARDING' });
    };

    return (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white relative shadow-lg overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                aria-label="Dismiss guide"
            >
                <X size={20} />
            </button>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">

                {/* Progress Section */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Flag size={20} className="text-yellow-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold font-heading">Guía de Inicio</h3>
                            <p className="text-indigo-200 text-sm">Completa estos pasos para configurar tu cuenta.</p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-yellow-300">{progress}%</span>
                    </div>
                </div>

                {/* Steps List */}
                <div className="flex-1 w-full md:w-auto">
                    <div className="space-y-3">
                        {steps.map((step, index) => {
                            const isCompleted = onboarding.completedSteps.includes(step.id);
                            const isCurrent = !isCompleted && (index === 0 || onboarding.completedSteps.includes(steps[index - 1].id));
                            const isLocked = !isCompleted && !isCurrent;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${isCurrent ? 'bg-white/10 border border-white/20' : 'opacity-60'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isCompleted ? (
                                            <CheckCircle size={20} className="text-emerald-400" />
                                        ) : (
                                            <Circle size={20} className={isCurrent ? 'text-yellow-300' : 'text-indigo-300'} />
                                        )}
                                        <span className={`text-sm font-medium ${isCompleted ? 'line-through text-indigo-300' : 'text-white'}`}>
                                            {step.title}
                                        </span>
                                    </div>

                                    {isCurrent && (
                                        <button
                                            onClick={() => handleAction(step.id, step.targetView)}
                                            className="text-xs bg-white text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center"
                                        >
                                            {step.actionLabel}
                                            <ArrowRight size={12} className="ml-1" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};
