import React, { useRef } from 'react';
import { MenuItem } from 'primereact/menuitem';
import { Menu } from 'primereact/menu';

interface IconMenuProps {
    icon: string;
    menu: MenuItem[];
}

export const IconMenu: React.FC<IconMenuProps> = ({ icon, menu }) => {
    const menuRef = useRef<Menu>(null);
    return (
        <>
            <i
                className={`pi pi-${icon} cursor-pointer hover:text-primary`}
                onClick={(event) => menuRef?.current?.toggle(event)}
            ></i>
            <Menu model={menu} popup ref={menuRef} />
        </>
    );
};
