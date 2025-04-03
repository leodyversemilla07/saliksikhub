import React from 'react';
import { PenLine, Send, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { ManuscriptStatus } from '@/types/manuscript';

const config: Record<ManuscriptStatus, { bg: string; text: string; icon: React.ElementType }> = {
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
    [ManuscriptStatus.UNDER_REVIEW]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: HelpCircle
    },
    [ManuscriptStatus.MINOR_REVISION]: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        icon: PenLine
    },
    [ManuscriptStatus.MAJOR_REVISION]: {
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        icon: PenLine
    },
    [ManuscriptStatus.IN_COPYEDITING]: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        icon: PenLine
    },
    [ManuscriptStatus.AWAITING_AUTHOR_APPROVAL]: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-700',
        icon: PenLine
    },
    [ManuscriptStatus.READY_FOR_PUBLICATION]: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-700',
        icon: PenLine
    },
    [ManuscriptStatus.PUBLISHED]: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        icon: CheckCircle2
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
