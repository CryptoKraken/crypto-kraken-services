import { KuCoinListTradingSymbolsTick } from 'src';

export const listTradingSymbolsTickCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/public-market-data/list-trading-symbols-tick-(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: [
            {
                coinType: 'KCS',
                trading: true,
                symbol: 'KCS-BTC',
                lastDealPrice: 4500,
                buy: 4120,
                sell: 4500,
                change: 0.00000451,
                coinTypePair: 'BTC',
                sort: 0,
                feeRate: 0.001,
                volValue: 324866889,
                high: 6890,
                datetime: 1506051488000,
                vol: 5363831663913,
                low: 4500,
                changeRate: -0.3431
            },
            {
                coinType: 'KNC',
                trading: true,
                symbol: 'KNC-BTC',
                lastDealPrice: null,
                buy: 1000000,
                sell: null,
                change: 0,
                coinTypePair: 'BTC',
                sort: 1,
                feeRate: 0.001,
                volValue: 0,
                high: null,
                datetime: 1506051488000,
                vol: 0,
                low: null,
                changeRate: null
            }
        ]
    } as KuCoinListTradingSymbolsTick,
    // When the 'market' parameter of a request is incorrect or unknown
    withEmptyData: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531236970644,
        data: []
    } as KuCoinListTradingSymbolsTick
};

export const wrongListTradingSymbolsTickCases = {
    withoutCoinType: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: [
            {
                coinType: 'KCS',
                trading: true,
                symbol: 'KCS-BTC',
                lastDealPrice: 4500,
                buy: 4120,
                sell: 4500,
                change: 0.00000451,
                coinTypePair: 'BTC',
                sort: 0,
                feeRate: 0.001,
                volValue: 324866889,
                high: 6890,
                datetime: 1506051488000,
                vol: 5363831663913,
                low: 4500,
                changeRate: -0.3431
            },
            {
                /* There isn't the coinType field */
                trading: true,
                symbol: 'KCS-BTC',
                lastDealPrice: null,
                buy: 1000000,
                sell: null,
                change: 0,
                coinTypePair: 'BTC',
                sort: 1,
                feeRate: 0.001,
                volValue: 0,
                high: null,
                datetime: 1506051488000,
                vol: 0,
                low: null,
                changeRate: null
            }
        ]
    } as KuCoinListTradingSymbolsTick,
    withoutSymbol: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: [
            {
                coinType: 'KCS',
                trading: true,
                /* There isn't the symbol field */
                lastDealPrice: 4500,
                buy: 4120,
                sell: 4500,
                change: 0.00000451,
                coinTypePair: 'BTC',
                sort: 0,
                feeRate: 0.001,
                volValue: 324866889,
                high: 6890,
                datetime: 1506051488000,
                vol: 5363831663913,
                low: 4500,
                changeRate: -0.3431
            },
            {
                coinType: 'KNC',
                trading: true,
                symbol: 'KCS-BTC',
                lastDealPrice: null,
                buy: 1000000,
                sell: null,
                change: 0,
                coinTypePair: 'BTC',
                sort: 1,
                feeRate: 0.001,
                volValue: 0,
                high: null,
                datetime: 1506051488000,
                vol: 0,
                low: null,
                changeRate: null
            }
        ]
    } as any as KuCoinListTradingSymbolsTick
};
