import { useState, useContext, useRef } from 'react';
import { PrimeReactContext } from 'primereact/api';
import { Menu } from 'primereact/menu';

const themes = [{ label: 'Light', value: 'value-more-light' }];

export const useThemeMenu = () => {
    const [theme, setTheme] = useState<string>(
        localStorage.getItem('theme') ?? 'value-more-light'
    );
    const menuRightRef = useRef<Menu>(null);
    const { changeTheme } = useContext(PrimeReactContext);

    const cgTheme = (newTheme: string) =>
        changeTheme?.(theme, newTheme, 'theme-link', () => {
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

    const themeItems = themes.map(({ label, value }) => {
        return {
            label,
            command: () => cgTheme(value),
            icon: value === theme ? 'pi pi-check-circle' : undefined
        };
    });

    return {
        theme,
        setTheme,
        menuRightRef,
        themeItems,
        cgTheme
    };
};
