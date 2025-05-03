import React from 'react';
import { Header } from './Header';
import { MenuItem } from 'primereact/menuitem';

interface BaseLayoutProps {
    menu?: MenuItem[];
    children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ menu, children }) => (
    <div className="overflow-y-auto overflow-x-hidden h-full">
        <Header menu={menu} />
        <div className="flex-auto" style={{ height: 'calc(100% - 60px)' }}>
            {children}
        </div>
    </div>
);
