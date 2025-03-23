import React from 'react';
import { PenLine, Send, Eye, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { ManuscriptStatus } from '@/types/manuscript';

const config: Record<ManuscriptStatus, { bg: string; text: string; icon: React.ElementType }> = {
    [ManuscriptStatus.DRAFT]: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: PenLine
    },
    [ManuscriptStatus.SUBMITTED]: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: Send
    },
    [ManuscriptStatus.ACCEPTED]: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: CheckCircle2
    },
    [ManuscriptStatus.REJECTED]: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: XCircle
    },
};

export function StatusBadge({ status }: { status: ManuscriptStatus }) {
    const normalizedStatus = status.toUpperCase() as ManuscriptStatus;
    const { bg, text, icon: Icon } = config[normalizedStatus] || {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        icon: HelpCircle
    };

    return (
        <span className={`px-4 py-2 ${bg} ${text} rounded-full text-sm font-medium inline-flex items-center gap-2`}>
            <Icon className="w-4 h-4" />
            {status.replace(/_/g, ' ')}
        </span>
    );
}
