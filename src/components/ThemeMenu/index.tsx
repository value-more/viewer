import React, { useState, useContext, useRef } from 'react'
import { PrimeReactContext } from 'primereact/api';
import { Menu } from 'primereact/menu';

const themes = [
    { label: 'Light', value: 'value-more-light' },
    { label: 'Mira', value: 'mira' }
]

export const ThemeMenu: React.FC = () => {
    const [theme, setTheme] = useState<string>(localStorage.getItem('theme') ?? 'value-more-light');
    const menuRight = useRef<Menu>(null);
    const { changeTheme } = useContext(PrimeReactContext);

    const cgTheme = (newTheme: string) => changeTheme?.(theme, newTheme, 'theme-link', () => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    const items = themes.map(({ label, value }) => {
        return {    
            label,
            command: () => cgTheme(value),
            icon: value === theme ? 'pi pi-check-circle' : undefined
        }
    });

    return (
        <>
            <Menu model={items} popup ref={menuRight} id="menuThemesChange" popupAlignment="right" />
            <i className='pi pi-palette cursor-pointer hover:text-primary' onClick={(event) => menuRight?.current?.toggle(event)} aria-controls="menuThemesChange" aria-haspopup />
        </>
    )
}