import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Get all available pages - check both Pages and pages directories
        const upperCasePages = import.meta.glob('./Pages/**/*.tsx');
        const lowerCasePages = import.meta.glob('./pages/**/*.tsx');

        // Combine both sets of pages
        const allPages = { ...upperCasePages, ...lowerCasePages };

         
        const resolvePage = (path: string) => resolvePageComponent(path, allPages) as any;

        // Handle mixed case patterns - try multiple combinations
        const paths = [
            // Check original path for exact case match
            `./pages/${name}.tsx`,
            `./Pages/${name}.tsx`,

            // Handle mixed case in directory structure (e.g. auth/Login.tsx)
            `./Pages/${name}.tsx`.replace(
                /\/([a-z])/g,
                (match, letter) => `/${letter}`,
            ),
            `./Pages/${name}.tsx`.replace(
                /\/([a-z])/g,
                (match, letter) => `/${letter.toUpperCase()}`,
            ),

            // Handle uppercase first letter in both path and filename
            `./Pages/${name.replace(/\b\w/g, (c) => c.toUpperCase())}.tsx`,

            // Check if only the filename is capitalized
            `./pages/${name.replace(
                /\/(\w+)$/,
                (match, filename) =>
                    '/' + filename.charAt(0).toUpperCase() + filename.slice(1),
            )}.tsx`,

            // Check if Pages directory with filename capitalized
            `./Pages/${name.replace(
                /\/(\w+)$/,
                (match, filename) =>
                    '/' + filename.charAt(0).toUpperCase() + filename.slice(1),
            )}.tsx`,
        ];

        // Try all possible paths
        for (const path of paths) {
            if (allPages[path]) {
                return resolvePage(path);
            }
        }

        // If we still haven't found it, try harder with path components
        const pathParts = name.split('/');
        const lastPart = pathParts.pop();

        // Only proceed if we have a valid last part
        if (lastPart) {
            // Try with capitalized filename in any directory structure
            const capitalizedFilename =
                lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
            const capitalizedPath = `./Pages/${pathParts.join('/')}/${capitalizedFilename}.tsx`;

            if (allPages[capitalizedPath]) {
                return resolvePage(capitalizedPath);
            }
        }

        // Default case - let it try the original path and show proper error
        return resolvePage(`./pages/${name}.tsx`);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <TooltipProvider>
                    <App {...props} />
                </TooltipProvider>
                <Toaster />
            </>,
        );
    },
    progress: {
        color: 'oklch(var(--primary))',
    },
});

// This will set light / dark mode on load...
initializeTheme();
