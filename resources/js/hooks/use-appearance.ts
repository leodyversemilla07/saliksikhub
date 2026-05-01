import { useCallback, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

function applyTheme(theme: Theme): void {
    if (
        theme === 'dark' ||
        (theme === 'system' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function useTheme() {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return 'system';
        }

        return (localStorage.getItem('theme') as Theme) || 'system';
    });

    const setTheme = useCallback((theme: Theme) => {
        localStorage.setItem('theme', theme);
        setThemeState(theme);
        applyTheme(theme);
    }, []);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                if (mediaQuery.matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    return { theme, setTheme };
}

// Initialize theme without requiring React context/hooks
export function initializeTheme() {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const theme = storedTheme || 'system';

    applyTheme(theme);
}

export default useTheme;
