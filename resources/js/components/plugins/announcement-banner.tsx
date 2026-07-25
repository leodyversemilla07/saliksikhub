import { X } from 'lucide-react';
import { useState } from 'react';

interface AnnouncementBannerProps {
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    dismissible?: boolean;
    storageKey?: string;
}

const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
};

const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
};

/**
 * Announcement banner component rendered by the AnnouncementBanner plugin.
 * Injected into the 'announcement_banner' slot by the plugin system.
 */
export function AnnouncementBanner({
    message,
    type = 'info',
    dismissible = true,
    storageKey = 'plugin_announcement_dismissed',
}: AnnouncementBannerProps) {
    const [visible, setVisible] = useState<boolean>(() => {
        if (dismissible) {
            return localStorage.getItem(storageKey) !== 'true';
        }

        return true;
    });

    if (!visible) {
        return null;
    }

    const handleDismiss = () => {
        setVisible(false);

        if (dismissible) {
            localStorage.setItem(storageKey, 'true');
        }
    };

    return (
        <div
            className={`mb-4 rounded-lg border px-4 py-3 ${typeStyles[type]}`}
            role="alert"
        >
            <div className="flex items-center gap-3">
                <span className="text-lg" aria-hidden="true">
                    {typeIcons[type]}
                </span>
                <p className="flex-1 text-sm font-medium">{message}</p>
                {dismissible && (
                    <button
                        type="button"
                        onClick={handleDismiss}
                        className="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        aria-label="Dismiss announcement"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
