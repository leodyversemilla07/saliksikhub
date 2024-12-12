import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
    steps: string[];
    currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${index < currentStep
                            ? 'bg-green-500 text-white'
                            : index === currentStep
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        {index < currentStep ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <span>{index + 1}</span>
                        )}
                    </div>
                    <span className="ml-2 text-sm font-medium">{step}</span>
                    {index < steps.length - 1 && (
                        <div className="w-12 h-1 mx-2 bg-gray-200">
                            <div
                                className={`h-full ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

