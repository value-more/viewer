import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menubar } from 'primereact/menubar'
import i18next from 'i18next'
import { Sidebar } from 'primereact/sidebar'
import { ChangeLog } from './components/ChangeLog'
import { ThemeMenu } from './components/ThemeMenu'
import { Avatar } from 'primereact/avatar';
import { MenuItem } from 'primereact/menuitem';
import { IconMenu } from './components/IconMenu'
import { CompanySearch } from './components/CompanySearch'

interface HeaderProps {
    menu?: MenuItem[];
}

export const Header: React.FC<HeaderProps> = ({ menu }) => {
    const navigate = useNavigate()
    const [visibleChangelog, setVisibleChangelog] = useState<boolean>();

    const changeLanguage = (lang: string) => {
        localStorage.setItem('lng', lang)
        i18next.changeLanguage(lang)
    }

    const languageMenuItems = [
        { label: 'English', command: () => changeLanguage('en') },
        { label: 'German', command: () => changeLanguage('de') }
    ];

    const start = (
        <div className='flex align-items-center gap-2 mr-2'>
            <img alt="logo" src={`${process.env.PUBLIC_URL}/logo.png`} height="40" className="mr-2 cursor-pointer" onClick={() => navigate({ pathname: '/' })} />
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-2">
            <CompanySearch />
            <div className='flex gap-3 mr-2 ml-2'>
                <i className='pi pi-bell'></i>
                <IconMenu icon='language' menu={languageMenuItems} />
                <ThemeMenu />
                <i className='pi pi-check-circle hover:text-primary cursor-pointer' onClick={() => navigate('/analysis')}></i>
                <i className='pi pi-cog hover:text-primary cursor-pointer' onClick={() => navigate('/config')}></i>
                <i className='pi pi-clock hover:text-primary cursor-pointer' onClick={() => setVisibleChangelog(true)}></i>
            </div>
            <Avatar icon="pi pi-user" shape="circle" />
        </div>
    );

    return (<>
        <div className='card flex align-items-center'>
            <Menubar model={menu} start={start} end={end} className='flex-1' />

            <Sidebar visible={visibleChangelog} onHide={() => setVisibleChangelog(false)} position='right' className='w-6'>
                <h2 className='mt-0 text-center'>Changelog</h2>
                <ChangeLog />
            </Sidebar>
        </div>
    </>)
}
