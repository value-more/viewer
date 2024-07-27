import React, { useEffect, useState } from 'react'
import { InvData } from '../../models/types'
import { InvDataViewerTable } from './InvDataViewerTable'
import { useTranslation } from 'react-i18next'
import { Config } from './types'
import { api } from '../../api/invData'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Accordion, AccordionTab } from 'primereact/accordion'

interface InvDataViewerProps {
    data?: InvData
}

export const InvDataViewer: React.FC<InvDataViewerProps> = ({
    data
}) => {
    const { t } = useTranslation();
    const [configs, setConfigs] = useState<Config[] | undefined>()

    useEffect(() => {
        const getConfig = async () => {
            const data = await api(`invData/companies/fundamentals/rules/display`)
            setConfigs(data)
        }
        getConfig()
    }, [])

    if ( !configs ) {
        return <div className='text-center'><ProgressSpinner /></div>;
    }
    
    return (
        <div>
            <h3 className="bg-primary p-2">{t('ticker.fundamentals.title')}</h3>
            <Accordion multiple>
            {configs.map((c, i) => (
                <AccordionTab key={i} header={t(`ticker.fundamentals.${c.name}.title`)}>
                    <InvDataViewerTable
                        dataKey={c.name}
                        structure={c.children}
                        data={data}
                    />
                </AccordionTab>
            ))}
            </Accordion>
        </div>
    )
}
