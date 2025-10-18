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
import { useUser, useUserRights } from './models/user/hooks';
import { logoutFx } from './models/user';
import { useTranslation } from 'react-i18next';
import { Feedback } from './components/Feedback';
import { PriceAlerts } from './components/companies/PriceAlerts';

interface HeaderProps {
    menu?: MenuItem[];
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, menu }) => {
    const user = useUser();
    const userRights = useUserRights();
    const navigate = useNavigate();
    const [visibleChangelog, setVisibleChangelog] = useState<boolean>(false);
    const [visibleFeedback, setVisibleFeedback] = useState<boolean>(false);
    const [visiblePriceAlerts, setVisiblePriceAlerts] =
        useState<boolean>(false);
    const isMedium = useIsMediumScreen();
    const menuUserRef = useRef<Menu | null>(null);
    const { themeItems } = useThemeMenu();
    const { t } = useTranslation();

    const changeLanguage = (lang: string) => {
        localStorage.setItem('lng', lang);
        i18next.changeLanguage(lang);
    };

    const items: MenuItem[] = [];

    if (user) {
        const userMenu = {
            label: t('menu.user'),
            items: [
                {
                    label: user.name ?? 'Anonymous',
                    disabled: true,
                    icon: 'pi pi-user'
                },
                {
                    label: t('menu.feedback'),
                    icon: 'pi pi-comments',
                    command: () => setVisibleFeedback(true)
                }
            ]
        };
        userMenu.items.push({
            label: t('menu.logout'),
            icon: 'pi pi-sign-out',
            command: () => logoutFx()
        });
        items.push(userMenu);
    } else {
        items.push({
            label: t('menu.signin'),
            icon: 'pi pi-sign-in',
            command: () => navigate('/login')
        });
    }

    items.push({
        label: t('menu.language'),
        icon: 'pi pi-globe',
        items: [
            { label: 'English', command: () => changeLanguage('en') },
            { label: 'German', command: () => changeLanguage('de') }
        ]
    });
    items.push({
        label: t('menu.themes'),
        items: themeItems
    });

    const adminItems = [];
    if (userRights?.['companies.missingRequiredData.view']) {
        adminItems.push({
            label: t('menu.analysis'),
            icon: 'pi pi-check-circle',
            command: () => navigate('/analysis')
        });
    }
    if (userRights?.['companies.config']) {
        adminItems.push({
            label: t('menu.config'),
            icon: 'pi pi-cog',
            command: () => navigate('/config')
        });
    }
    if (userRights?.['logs']) {
        adminItems.push({
            label: t('menu.logs'),
            icon: 'pi pi-clock',
            command: () => setVisibleChangelog(true)
        });
    }
    if (adminItems.length) {
        items.push({
            label: t('menu.admin'),
            items: adminItems
        });
    }

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
            {userRights?.['prices.alerts'] && (
                <div className="flex gap-3 mr-2 ml-2 align-items-center cursor-pointer">
                    <i
                        className="pi pi-bell"
                        onClick={() => setVisiblePriceAlerts(true)}
                    ></i>
                </div>
            )}
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

                {visibleChangelog && (
                    <Sidebar
                        visible={visibleChangelog}
                        onHide={() => setVisibleChangelog(false)}
                        position="right"
                        className="w-6"
                    >
                        <h2 className="mt-0 text-center">Changelog</h2>
                        <ChangeLog />
                    </Sidebar>
                )}
                {visibleFeedback && (
                    <Sidebar
                        visible={visibleFeedback}
                        modal
                        onHide={() => setVisibleFeedback(false)}
                        position="right"
                    >
                        <h2 className="mt-0 text-center">
                            {t('menu.feedback')}
                        </h2>
                        <Feedback onSuccess={() => setVisibleFeedback(false)} />
                    </Sidebar>
                )}
                {userRights?.['prices.alerts'] && visiblePriceAlerts && (
                    <Sidebar
                        visible={visiblePriceAlerts}
                        modal
                        onHide={() => setVisiblePriceAlerts(false)}
                        position="right"
                        className="w-3"
                    >
                        <h2 className="mt-0">{t('menu.pricealerts')}</h2>
                        <PriceAlerts />
                    </Sidebar>
                )}
            </div>
        </>
    );
};
