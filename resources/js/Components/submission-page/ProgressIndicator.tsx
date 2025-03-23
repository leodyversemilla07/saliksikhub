import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
    steps: string[];
    currentStep: number;
    completedSteps?: number[];
}

export function ProgressIndicator({
    steps,
    currentStep,
    completedSteps = []
}: ProgressIndicatorProps) {
    return (
        <div className="hidden md:flex items-center justify-between w-full" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={currentStep + 1}>
            {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isActive = index === currentStep;
                const isPast = index < currentStep;
                
                // For screen readers
                const stepStatus = isCompleted ? 'completed' : isActive ? 'current' : 'pending';

                return (
                    <div key={step} className="flex items-center flex-1" data-step={index + 1} data-status={stepStatus}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isCompleted || isPast
                                        ? 'bg-green-500 text-white shadow-md shadow-green-200'
                                        : isActive
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-4 ring-blue-100'
                                            : 'bg-gray-200 text-gray-600'
                                }`}
                                aria-label={`Step ${index + 1}: ${step} (${stepStatus})`}
                            >
                                {isCompleted || isPast ? (
                                    <Check className="w-5 h-5 animate-pulse-once" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>
                            <span 
                                className={`mt-2 text-sm font-medium transition-colors duration-200 ${
                                    isActive 
                                        ? 'text-blue-600 font-semibold' 
                                        : isCompleted || isPast 
                                            ? 'text-green-600' 
                                            : 'text-gray-500'
                                }`}
                            >
                                {step}
                            </span>
                        </div>
                        
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-1 mx-4 bg-gray-200 relative">
                                <div
                                    className={`h-full transition-all duration-500 ease-in-out ${
                                        isCompleted || isPast ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                                    style={{ 
                                        width: isCompleted || isPast ? '100%' : '0%',
                                    }}
                                    role="presentation"
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

