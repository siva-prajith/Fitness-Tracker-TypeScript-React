// Theme toggle button disabled — whole component commented out.
// import { Moon, Sun } from 'lucide-react';
// import { useTheme } from '../../context/ThemeContext';
//
// export default function ThemeToggle() {
//     const { theme, toggleTheme } = useTheme();
//     const isDark = theme === 'dark';
//
//     return (
//         <button
//             type='button'
//             onClick={toggleTheme}
//             aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
//             title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
//             className='fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 transition-colors duration-200 cursor-pointer'
//         >
//             {isDark ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
//         </button>
//     );
// }

export {};
