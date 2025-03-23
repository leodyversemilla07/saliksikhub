import { useEffect, useState } from 'react';

interface CircleProgressProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    circleColor?: string;
    progressColor?: string;
    textColor?: string;
    showPercentage?: boolean;
}

export function CircleProgress({
    percentage,
    size = 100,
    strokeWidth = 10,
    circleColor = '#E5E7EB', // gray-200
    progressColor = '#4F46E5', // primary color
    textColor = '#1F2937', // gray-800
    showPercentage = false,
}: CircleProgressProps) {
    const [progress, setProgress] = useState(0);

    // Animate the progress
    useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(percentage);
        }, 100);

        return () => clearTimeout(timer);
    }, [percentage]);

    // Calculate circle properties
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // Calculate center point
    const center = size / 2;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={circleColor}
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>

            {/* Percentage text */}
            {showPercentage && (
                <div
                    className="absolute inset-0 flex items-center justify-center font-medium"
                    style={{ color: textColor }}
                >
                    {progress}%
                </div>
            )}
        </div>
    );
}
