import React from 'react';
import { Header } from './Header';
import { MenuItem } from 'primereact/menuitem';
import { Footer } from './Footer';

interface BaseLayoutProps {
    menu?: MenuItem[];
    children: React.ReactNode;
    title?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
    title = 'Value More',
    menu,
    children
}) => (
    <div className="overflow-y-auto overflow-x-hidden h-full">
        <Header menu={menu} title={title} />
        <div className="flex-auto" style={{ height: 'calc(100% - 90px)' }}>
            {children}
        </div>
        <Footer />
    </div>
);
