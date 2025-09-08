import React from 'react';
import { Menu } from 'primereact/menu';
import { useThemeMenu } from './useThemeMenu';

export const ThemeMenu: React.FC = () => {
    const { themeItems, menuRightRef } = useThemeMenu();
    return (
        <>
            <Menu
                model={themeItems}
                popup
                ref={menuRightRef}
                id="menuThemesChange"
                popupAlignment="right"
            />
            <i
                className="pi pi-palette cursor-pointer hover:text-primary"
                onClick={(event) => menuRightRef?.current?.toggle(event)}
                aria-controls="menuThemesChange"
                aria-haspopup
            />
        </>
    );
};
