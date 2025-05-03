import React, { useEffect, useRef, memo } from 'react';

interface TradindViewSymbolOverviewProps {
    ticker: string;
    exchange: string;
}

const pTradingViewSymbolOverview: React.FC<TradindViewSymbolOverviewProps> = ({
    ticker,
    exchange
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src =
            'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = `
      {
          "symbols": [ [ "${exchange}:${ticker}|1D" ] ],
          "chartOnly": false,
          "locale": "en",
          "colorTheme": "light",
          "autosize": true,
          "scalePosition": "right",
          "scaleMode": "Normal",
          "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
          "fontSize": "10",
          "valuesTracking": "1",
          "changeMode": "price-and-percent",
          "chartType": "area",
          "lineWidth": 2,
          "lineType": 0,
          "dateRanges": [ "1d|1", "1m|1D", "3m|60", "12m|1D", "60m|1W", "all|1M" ]
        } `;
        container?.current?.appendChild(script);
    }, [ticker]);

    return (
        <div
            className="tradingview-widget-container w-full"
            ref={container}
        ></div>
    );
};

export const TradingViewSymbolOverview = memo(pTradingViewSymbolOverview);
