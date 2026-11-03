import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'theme-choice';
const OLD_THEME_KEYS = ['theme', 'app-theme'];

function getStoredTheme() {
    OLD_THEME_KEYS.forEach((key) => localStorage.removeItem(key));
    return localStorage.getItem(THEME_KEY);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState(() => getStoredTheme()
        || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme])

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            localStorage.removeItem(THEME_KEY);
            setTheme(e.matches ? 'dark' : 'light');
        };
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, [])

    const toggleTheme = () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, nextTheme);
        setTheme(nextTheme);
    }

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within an ThemeProvider');
    }
    return context;
}