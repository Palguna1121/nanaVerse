import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialTheme = browser && (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))
    ? 'dark'
    : 'light';

export const theme = writable<string>(initialTheme);

if (browser) {
    theme.subscribe(value => {
        localStorage.theme = value;
        if (value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}

export const toggleTheme = () => {
    theme.update(current => current === 'dark' ? 'light' : 'dark');
};
