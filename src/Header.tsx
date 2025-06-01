import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import i18next from 'i18next';
import { Sidebar } from 'primereact/sidebar';
import { ChangeLog } from './components/ChangeLog';
import { Avatar } from 'primereact/avatar';
import { MenuItem } from 'primereact/menuitem';
import { CompanySearch } from './components/CompanySearch';
import { useIsMediumScreen } from './utils/breakpointsHook';
import { Menu } from 'primereact/menu';
import { useThemeMenu } from './components/ThemeMenu/useThemeMenu';

interface HeaderProps {
    menu?: MenuItem[];
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, menu }) => {
    const navigate = useNavigate();
    const [visibleChangelog, setVisibleChangelog] = useState<boolean>();
    const isMedium = useIsMediumScreen();
    const menuUserRef = useRef<Menu | null>(null);
    const { themeItems } = useThemeMenu();

    const changeLanguage = (lang: string) => {
        localStorage.setItem('lng', lang);
        i18next.changeLanguage(lang);
    };

    const items: MenuItem[] = [
        {
            label: 'Language',
            icon: 'pi pi-globe',
            items: [
                { label: 'English', command: () => changeLanguage('en') },
                { label: 'German', command: () => changeLanguage('de') }
            ]
        },
        {
            label: 'Themes',
            items: themeItems
        },
        {
            label: 'Admin',
            items: [
                {
                    label: 'Analysis',
                    icon: 'pi pi-check-circle',
                    command: () => navigate('/analysis')
                },
                {
                    label: 'Config',
                    icon: 'pi pi-cog',
                    command: () => navigate('/config')
                },
                {
                    label: 'Logs',
                    icon: 'pi pi-clock',
                    command: () => setVisibleChangelog(true)
                }
            ]
        }
    ];

    const start = (
        <div className="flex align-items-center gap-2 mr-2">
            <img
                alt="logo"
                src={`${process.env.PUBLIC_URL}/logo.png`}
                height="36"
                className="mr-2 cursor-pointer"
                onClick={() => navigate({ pathname: '/' })}
            />
            {isMedium && title && (
                <div className="text-primary text-5xl pt-2">{title}</div>
            )}
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-2">
            <CompanySearch />
            <div className="flex gap-3 mr-2 ml-2 align-items-center">
                <i className="pi pi-bell"></i>
            </div>
            <Avatar
                icon="pi pi-user"
                shape="circle"
                onClick={(event) => menuUserRef?.current?.toggle(event)}
            />
            <Menu model={items} popup ref={menuUserRef} />
        </div>
    );

    return (
        <>
            <div className="card flex align-items-center">
                <Menubar
                    model={menu}
                    start={start}
                    end={end}
                    className="flex-1"
                />

                <Sidebar
                    visible={visibleChangelog}
                    onHide={() => setVisibleChangelog(false)}
                    position="right"
                    className="w-6"
                >
                    <h2 className="mt-0 text-center">Changelog</h2>
                    <ChangeLog />
                </Sidebar>
            </div>
        </>
    );
};
