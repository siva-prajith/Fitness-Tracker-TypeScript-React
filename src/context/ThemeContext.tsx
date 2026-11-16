import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemePreference = Theme | 'system';

interface ThemeContextType {
    /** The theme actually applied to the page. */
    theme: Theme;
    /** What the user chose: an explicit theme, or follow the OS/browser. */
    preference: ThemePreference;
    setPreference: (preference: ThemePreference) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Keys written by earlier versions that saved the choice. The choice is no longer
// saved: every page load follows the Chrome/system Appearance setting.
const OLD_THEME_KEYS = ['theme', 'app-theme', 'theme-choice', 'theme-preference', 'theme-preference-system'];
const DARK_QUERY = '(prefers-color-scheme: dark)';

function getSystemTheme(): Theme {
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

function clearOldKeys() {
    try {
        OLD_THEME_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch { /* storage unavailable */ }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // The Sidebar choice lives in memory only, so it lasts until the next reload.
    const [preference, setPreference] = useState<ThemePreference>(() => {
        clearOldKeys();
        return 'system';
    });
    const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme);

    const theme: Theme = preference === 'system' ? systemTheme : preference;

    // Apply the resolved theme to <html>.
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        root.style.colorScheme = theme; // native scrollbars / form controls
    }, [theme]);

    // When the Chrome/system setting changes, it wins over the Sidebar choice.
    useEffect(() => {
        const media = window.matchMedia(DARK_QUERY);
        const handleChange = (e: MediaQueryListEvent) => {
            setPreference('system');
            setSystemTheme(e.matches ? 'dark' : 'light');
        };
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        const next: Theme = theme === 'light' ? 'dark' : 'light';
        setPreference(next === systemTheme ? 'system' : next);
    };

    return <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
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
