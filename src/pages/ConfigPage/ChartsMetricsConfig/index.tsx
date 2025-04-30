import React, { useState } from 'react'
import { ConfigEditor } from '../ConfigEditor'
import { Button } from 'primereact/button';

export const ChartsMetricsConfig: React.FC = () => {
    const [displayDoc, setDisplayDoc] = useState<boolean>(true);
    return (
        <>
            <div className='flex mb-3 gap-3'>
                <Button onClick={() => setDisplayDoc(!displayDoc)}>Toggle documentation</Button>
            </div>
            { displayDoc && 
                (<div className='ml-1 mb-1'>
                    <div className='flex'>
                        <div className='w-6'>
                            <ul className='mt-1'>
                                <li className='mb-2'>
                                    <b className='text-primary'>key</b>: name of chart. Will be used in scores config
                                </li>
                                <li className='mb-2'>
                                    <b className='text-primary'>labels</b>: X axis. Specials values: 
                                    <div className='ml-3'>
                                        <div>- <b>years</b>: use to get all available years (last 10 max)</div>
                                        <div>- <b>lastYear</b>: use to get last year. Can be combined with Math. Ex: <b>lastYear+1</b></div>
                                    </div>
                                </li>
                                <li>
                                    <b className='text-primary'>additionalData</b>: global metric to be displayed on the right of a chart
                                    <div className='ml-3'>
                                        <div><b>key</b>: identifier (for translation key)</div>
                                        <div><b>metric</b>: global metric to use (not yearly!)</div>
                                        <div><b>symbol</b>: (optional) display symbol after number. If no values then display nothing.
                                            <div className='ml-3'>Possible values: <b>%</b> (divid by 100 and display %), <b>d%</b> (display %), <b>$</b> (display currency)</div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className='w-6'>
                            <ul className='mt-1'>
                                <li className='mb-2'>
                                    <b className='text-primary'>datasets</b>: Define different Y lines
                                    <div className='ml-3'>
                                        <div>- <b>constant</b>: to set a contant for each year</div>
                                        <div>- <b>metric</b>: use yearly metric key as value by year. Ex: <b>operatingIncome</b></div>
                                        <div>- <b>data</b>: use any data as value by year. Ex: <b className='text-xs'>BALANCE_SHEET.CASH_AND_CASH_EQUIVALENTS</b></div>
                                        <div>
                                            - <b>formula</b>: to define basic math to execute for each year. (not yet for formula lib) 
                                            <div className='ml-6'><b>ly</b> for last year / <b>metrics</b> for global metrics</div>
                                        </div>
                                        <div>- <b>borderColor</b>: color of line</div>
                                    </div>
                                </li>
                                <li className='mb-2'>
                                    <b className='text-primary'>type</b>: Define type of chart line - <b>line</b>, <b>bar</b>, <b>pie</b>, <b>doughnut</b>, <b>polarArea</b>. Default line.
                                </li>
                                <li className='mb-2'>
                                    <b className='text-primary'>stacked</b>: stacked y axis if type supports it. Default false.
                                </li>
                                <li>
                                    <b className='text-primary'>hideScales</b>: if <b>true</b> then will hide the scales lines (axis x, y). Default false.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>)
            }
            <ConfigEditor endpoint='companies/metrics/charts/rules' />
        </>
    )
}