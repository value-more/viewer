import React, { useEffect, useRef, useState } from 'react';
import '../../../models/company/scores/init';
import '../../../models/company/values/init';
import '../../../models/company/status/init';
import { Sidebar } from 'primereact/sidebar';
import { InvData } from '../../../models/types';
import { api } from '../../../api/invData';
import { useTranslation } from 'react-i18next';
import { TradingViewSymbolOverview } from '../../../components/tradingView/SymbolOverview';
import { BusinessModel } from '../../../components/companies/BusinessModel';
import { Moat } from '../../../components/companies/Moat';
import { CompanyScore } from '../../../components/companies/CompanyScore';
import { CompanyValue } from '../../../components/companies/CompanyValue';
import { IntrinsicValue } from '../../../components/companies/IntrinsicValue';
import { ConfidenceLevels } from '../../../components/companies/ConfidenceLevels';
import { ChatAssistant } from '../../../components/ChatAssistant';
import { InvDataViewer } from '../../../components/InvDataViewer';
import { IndicatorsGraph } from '../../../components/IndicatorsGraphs';
import { Avatar } from '@chatscope/chat-ui-kit-react';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MetricsAssessment } from '../../../components/companies/MetricsAssessment';
import { CompanyProfile } from '../../../components/companies/CompanyProfile';
import { useUserRights } from '../../../models/user/hooks';
import { Navigate } from 'react-router';
import { ApproveButton } from '../../../components/companies/CompanyStatus/ApproveButton';
import { companyStatusEvents } from '../../../models/company/status';
import { CompanyStatus } from '../../../components/companies/CompanyStatus';
import { StatusWorkflow } from '../../../models/company/status/types';

interface CompanyPageEditProps {
    cik: number;
    name: string;
    data: InvData;
    refs: { [key: string]: React.MutableRefObject<null> };
}

export const CompanyPageEdit: React.FC<CompanyPageEditProps> = ({
    cik,
    name: defaultName,
    data,
    refs
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [isVisibleAssistant, setIsVisibleAssistant] =
        useState<boolean>(false);
    const [isVisibleEditCompanyName, setIsVisibleEditCompanyName] =
        useState<boolean>(false);
    const [name, setName] = useState<string>(defaultName);
    const priceOverviewRef = useRef(null);
    const urs = useUserRights();

    useEffect(() => {
        if (cik) companyStatusEvents.setCik(cik);
    }, [cik]);

    if (!urs?.['companies.edit']) return <Navigate to={`/company/${cik}`} />;

    const yearsKeys = Object.keys(data?.years || {});

    const saveCompanyName = async () => {
        await api(`invData/companies/${cik}`, {
            method: 'PUT',
            body: JSON.stringify({ name })
        });
        setIsVisibleEditCompanyName(false);
    };

    return (
        <>
            <div className="ml-4 pr-4 pb-4 overflow-auto h-full">
                <div ref={refs.overview}></div>
                <div className="flex align-items-center justify-content-center mb-2 z-5 sticky top-0 bg-default">
                    <div
                        className={`companyLogo48 ${data?.tickers?.map((t) => 't-logo-' + t.ticker).join(' ')} mr-2`}
                    ></div>
                    <h1 className="text-center mt-0 mb-0">
                        {name}{' '}
                        <i
                            className="pi pi-pencil vertical-align-top text-xs cursor-pointer"
                            onClick={() => setIsVisibleEditCompanyName(true)}
                        />
                    </h1>
                    <div className="ml-3">
                        <CompanyScore withTooltip />
                    </div>
                    <div className="ml-2">
                        <CompanyStatus />
                    </div>
                </div>
                <CompanyProfile cik={cik} edit />
                <ConfidenceLevels
                    timeframe={{
                        startYear: parseInt(yearsKeys.slice(-11)[0]),
                        endYear: parseInt(yearsKeys[yearsKeys.length - 1])
                    }}
                    overwriteTimestamp={data?.overwriteTimestamp}
                />
                <div ref={refs.data} className="scrollMarginTop mb-5">
                    <InvDataViewer
                        cik={cik}
                        syncTimestamp={data?.timestamp}
                        overwriteTimestamp={data?.overwriteTimestamp}
                        withIcon
                    />
                </div>
                <div ref={refs.diagrams} className="scrollMarginTop mb-5">
                    <IndicatorsGraph data={data} includeScore withIcon />
                </div>
                <div ref={refs.businessModel} className="scrollMarginTop mb-5">
                    <BusinessModel
                        cik={cik}
                        withIcon
                        readonly={language === 'en'}
                    />
                </div>
                <Moat cik={cik} />
                <div ref={refs.value} className="scrollMarginTop mb-5">
                    <CompanyValue
                        cik={cik}
                        metrics={data.metrics}
                        withSummary
                        withConfig
                        withIcon
                    />
                </div>
                <IntrinsicValue
                    ticker={data?.tickers[0]?.ticker || ''}
                    withTitle
                    defaultLevelSelector
                />
                <div>
                    <h3 className="bg-primary p-2" ref={priceOverviewRef}>
                        <i className="pi pi-dollar mr-2" />
                        {t('ticker.market.title')}
                    </h3>
                    <TradingViewSymbolOverview
                        ticker={data?.tickers?.[0]?.ticker || ''}
                        exchange={data?.tickers?.[0]?.exchange || ''}
                    />
                </div>
                <div>
                    <h3 className="bg-primary p-2 flex">
                        <div>Current situation</div>
                        <div className="ml-auto">
                            <ApproveButton
                                statusKey={StatusWorkflow.ASSESSED}
                            />
                        </div>
                    </h3>
                    <MetricsAssessment cik={cik} />
                </div>

                <Sidebar
                    visible={isVisibleAssistant}
                    position="right"
                    className="w-10"
                    showCloseIcon={true}
                    onHide={() => setIsVisibleAssistant(false)}
                >
                    <ChatAssistant
                        companyCik={cik}
                        companyName={data?.name ?? ''}
                    />
                </Sidebar>
                <Tooltip
                    target=".assistantIcon"
                    content="Hey, I'm Charlie :) How may I help you?"
                    position="left"
                />
                <div
                    className="fixed p-1 bg-white border-circle"
                    style={{
                        zIndex: 20,
                        bottom: '1rem',
                        right: '1rem',
                        border: '1px solid #ccc'
                    }}
                >
                    <Avatar
                        className="cursor-pointer assistantIcon"
                        src={`${process.env.PUBLIC_URL}/charlie_120.png`}
                        onClick={() => setIsVisibleAssistant(true)}
                    />
                </div>
            </div>
            <Dialog
                header="Edit company name"
                visible={isVisibleEditCompanyName}
                onHide={() => setIsVisibleEditCompanyName(false)}
                className="w-5"
            >
                <div className="flex">
                    <InputText
                        value={name}
                        className="flex-1"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button className="ml-2" onClick={() => saveCompanyName()}>
                        Save
                    </Button>
                </div>
            </Dialog>
        </>
    );
};
