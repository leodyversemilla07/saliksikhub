import { BookOpen, Clock, Edit, CheckCircle, XCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ManuscriptStatus } from '@/types';
import { Badge } from './ui/badge';

interface ManuscriptStatusBadgeProps {
    status: ManuscriptStatus;
    className?: string;
}

export function StatusBadge({ status, className }: ManuscriptStatusBadgeProps) {
    // Helper function to get appropriate styles and icon for status - Scholarly Design System
    const getStatusConfig = () => {
        switch (status) {
            case ManuscriptStatus.SUBMITTED:
                return {
                    icon: <Edit className="mr-1 h-3.5 w-3.5" />,
                    // Prussian Blue - info color
                    color: 'bg-[oklch(0.48_0.08_235)]/10 text-[oklch(0.48_0.08_235)] dark:text-[oklch(0.60_0.08_235)] border-[oklch(0.48_0.08_235)]/20',
                };
            case ManuscriptStatus.UNDER_REVIEW:
                return {
                    icon: <Clock className="mr-1 h-3.5 w-3.5" />,
                    // Amber - warning color
                    color: 'bg-[oklch(0.65_0.15_75)]/10 text-[oklch(0.65_0.15_75)] dark:text-[oklch(0.70_0.14_75)] border-[oklch(0.65_0.15_75)]/20',
                };
            case ManuscriptStatus.MINOR_REVISION:
                return {
                    icon: <Edit className="mr-1 h-3.5 w-3.5" />,
                    // Amber - warning color
                    color: 'bg-[oklch(0.65_0.15_75)]/10 text-[oklch(0.65_0.15_75)] dark:text-[oklch(0.70_0.14_75)] border-[oklch(0.65_0.15_75)]/20',
                };
            case ManuscriptStatus.MAJOR_REVISION:
                return {
                    icon: <Edit className="mr-1 h-3.5 w-3.5" />,
                    // Darker amber/orange
                    color: 'bg-[oklch(0.60_0.16_70)]/10 text-[oklch(0.60_0.16_70)] dark:text-[oklch(0.65_0.15_70)] border-[oklch(0.60_0.16_70)]/20',
                };
            case ManuscriptStatus.ACCEPTED:
                return {
                    icon: <CheckCircle className="mr-1 h-3.5 w-3.5" />,
                    // Forest Green - success color
                    color: 'bg-[oklch(0.45_0.10_145)]/10 text-[oklch(0.45_0.10_145)] dark:text-[oklch(0.55_0.10_145)] border-[oklch(0.45_0.10_145)]/20',
                };
            case ManuscriptStatus.IN_COPYEDITING:
                return {
                    icon: <Edit className="mr-1 h-3.5 w-3.5" />,
                    // Oxford Blue - primary color
                    color: 'bg-[oklch(0.35_0.08_250)]/10 text-[oklch(0.35_0.08_250)] dark:text-[oklch(0.60_0.10_250)] border-[oklch(0.35_0.08_250)]/20',
                };
            case ManuscriptStatus.AWAITING_AUTHOR_APPROVAL:
                return {
                    icon: <Eye className="mr-1 h-3.5 w-3.5" />,
                    // Burgundy - accent color
                    color: 'bg-[oklch(0.40_0.12_15)]/10 text-[oklch(0.40_0.12_15)] dark:text-[oklch(0.55_0.12_15)] border-[oklch(0.40_0.12_15)]/20',
                };
            case ManuscriptStatus.READY_FOR_PUBLICATION:
                return {
                    icon: <BookOpen className="mr-1 h-3.5 w-3.5" />,
                    // Darker Forest Green
                    color: 'bg-[oklch(0.40_0.12_145)]/10 text-[oklch(0.40_0.12_145)] dark:text-[oklch(0.55_0.12_145)] border-[oklch(0.40_0.12_145)]/20',
                };
            case ManuscriptStatus.REJECTED:
                return {
                    icon: <XCircle className="mr-1 h-3.5 w-3.5" />,
                    // Crimson - destructive/error color
                    color: 'bg-[oklch(0.50_0.20_25)]/10 text-[oklch(0.50_0.20_25)] dark:text-[oklch(0.55_0.18_25)] border-[oklch(0.50_0.20_25)]/20',
                };
            case ManuscriptStatus.PUBLISHED:
                return {
                    icon: <BookOpen className="mr-1 h-3.5 w-3.5" />,
                    // Deep Forest Green - published success
                    color: 'bg-[oklch(0.45_0.10_145)]/10 text-[oklch(0.45_0.10_145)] dark:text-[oklch(0.55_0.10_145)] border-[oklch(0.45_0.10_145)]/20',
                };
            default:
                return {
                    icon: <Clock className="mr-1 h-3.5 w-3.5" />,
                    // Muted gray
                    color: 'bg-muted/50 text-muted-foreground border-border',
                };
        }
    };

    const { icon, color } = getStatusConfig();

    return (
        <Badge className={cn('font-sans', color, className)}>
            {icon}
            {status}
        </Badge>
    );
}
