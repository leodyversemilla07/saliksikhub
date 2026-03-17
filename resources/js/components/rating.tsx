import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
    value: number;
    onChange?: (value: number) => void;
    max?: number;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export function Rating({
    value,
    onChange,
    max = 10,
    readonly = false,
    size = 'md',
    showValue = true,
}: RatingProps) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 8) return 'text-green-500';
        if (rating >= 6) return 'text-blue-500';
        if (rating >= 4) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {Array.from({ length: max }).map((_, index) => {
                    const starValue = index + 1;
                    const isFilled = starValue <= value;

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => !readonly && onChange?.(starValue)}
                            disabled={readonly}
                            className={cn(
                                'transition-colors',
                                !readonly && 'hover:scale-110 cursor-pointer',
                                readonly && 'cursor-default'
                            )}
                        >
                            <Star
                                className={cn(
                                    sizes[size],
                                    isFilled ? cn('fill-current', getRatingColor(value)) : 'text-gray-300'
                                )}
                            />
                        </button>
                    );
                })}
            </div>
            {showValue && (
                <span className={cn('text-sm font-medium', getRatingColor(value))}>
                    {value}/{max}
                </span>
            )}
        </div>
    );
}
