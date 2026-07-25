import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { registerCmsPluginSections } from './components/cms/plugins';
import { initializeTheme } from './hooks/use-appearance';
import { registerCorePluginComponents } from './plugins';

// Register plugin components before mounting
registerCorePluginComponents();
registerCmsPluginSections();

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx');

        return resolvePageComponent(`./pages/${name}.tsx`, pages);
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
