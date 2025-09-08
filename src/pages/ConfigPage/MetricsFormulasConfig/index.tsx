import React, { useState } from 'react';
import { ConfigEditor } from '../ConfigEditor';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Tests } from './Tests';
import { Dropdown } from 'primereact/dropdown';
import { DetailedFormula } from './DetailedFormula';

const profiles = [{ name: 'dev' }, { name: 'prod' }];

export const MetricsFormulasConfig: React.FC = () => {
    const [displayDoc, setDisplayDoc] = useState<boolean>(true);
    const [displaySidebarTests, setDisplaySidebarTests] =
        useState<boolean>(false);
    const [displayDetailedFormula, setDisplayDetailedFormula] =
        useState<boolean>(false);
    const [profile, setProfile] = useState<{ name: string }>({ name: 'dev' });
    return (
        <>
            <div className="flex mb-3 gap-3">
                <Button onClick={() => setDisplayDoc(!displayDoc)}>
                    Toggle documentation
                </Button>
                <Button onClick={() => setDisplaySidebarTests(true)}>
                    Tests
                </Button>
                <Button onClick={() => setDisplayDetailedFormula(true)}>
                    Detailed formula
                </Button>
                <div>
                    Profile{' '}
                    <Dropdown
                        options={profiles}
                        optionLabel="name"
                        value={profile}
                        onChange={(e) => setProfile(e.value)}
                    />
                </div>
            </div>
            {displayDoc && (
                <div className="ml-1 mb-1">
                    <div className="mb-3">
                        <b>
                            Global metrics will be calculated if at last 10
                            years are available and yearly metrics depends on
                            required parameters.
                        </b>
                        . Available formula at{' '}
                        <a
                            href="https://formulajs.info/functions/"
                            rel="noreferrer"
                            target="_blank"
                        >
                            https://formulajs.info/functions/
                        </a>
                        .
                    </div>
                    <div className="mb-3">
                        The <b>prod</b> profile is used for the companies. The{' '}
                        <b>dev</b> profile is for testing with the tests. Tests
                        are common but results are based on profile.
                    </div>
                    <div className="flex">
                        <div className="w-6">
                            <div>Global metrics (metrics)</div>
                            <ul className="mt-1">
                                <li>
                                    <b className="text-primary">f</b>: access
                                    any formula. Ex: <b>f.ROUND( 2.25, 1 )</b>
                                </li>
                                <li>
                                    <b className="text-primary">metrics</b>:
                                    Read any previously calculated gobal metrics
                                </li>
                                <li>
                                    <b className="text-primary">ly</b>: Access
                                    data of last year. Ex: <b>ly.metrics</b>
                                </li>
                                <li>
                                    <b className="text-primary">
                                        lym0 .. lym15
                                    </b>
                                    : Access data of last year minus 0 to 15.
                                    Ex: <b>lym9.metrics</b> = 10 years ago
                                </li>
                                <li>
                                    <b className="text-primary">lastYear</b>:
                                    Get last year as number. Ex: 2023
                                </li>
                                <li>
                                    <b className="text-primary">
                                        lastYearM0 .. lastYearM15
                                    </b>
                                    : Get last year minus 0 to 15 as number. Ex:{' '}
                                    <b>lastYearM9</b> = 2014
                                </li>
                                <li>
                                    <b className="text-primary">row</b>:
                                    function to return array of data for a field
                                    or metric useful for <b>f.SUM</b>. Key and
                                    amount of years.
                                    <br />
                                    <span className="ml-5">
                                        Ex:{' '}
                                        <b>
                                            f.SUM(row(&apos;metrics.investmentMargin&apos;,
                                            10))
                                        </b>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-6">
                            <div>Metrics per year (year.metrics)</div>
                            <ul className="mt-1">
                                <li>
                                    <b className="text-primary">f</b>: access
                                    any formula. Ex: <b>f.ROUND( 2.25, 1 )</b>
                                </li>
                                <li>
                                    <b className="text-primary">
                                        INCOME_STATEMENT
                                    </b>
                                    , ... : Data from fundamentals
                                </li>
                                <li>
                                    <b className="text-primary">metrics</b>:
                                    Read any previously calculated metrics for
                                    the same year
                                </li>

                                <li>
                                    <b className="text-primary">py</b>: Get
                                    values of previous year. <br />
                                    <span className="ml-4">
                                        Ex: <b>py.INCOME_STATEMENT</b>, ...
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <ConfigEditor
                endpoint="companies/metrics/formulas"
                profile={profile.name}
            />
            <Sidebar
                visible={displayDetailedFormula}
                position="right"
                onHide={() => setDisplayDetailedFormula(false)}
                className="w-10"
                showCloseIcon={false}
            >
                <DetailedFormula profile={profile.name} />
            </Sidebar>
            <Sidebar
                visible={displaySidebarTests}
                position="right"
                onHide={() => setDisplaySidebarTests(false)}
                className="w-24rem"
            >
                <Tests profile={profile.name} />
            </Sidebar>
        </>
    );
};
