import { KuCoinListTradingMarkets } from 'src';

export const listTradingMarketsCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/public-market-data/list-trading-markets(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1509939797091,
        data: [
            'BTC',
            'ETH',
            'NEO',
            'USDT'
        ]
    } as KuCoinListTradingMarkets
};

export const wrongListTradingMarketsCases = {
    withWrongCoinName: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1509939797091,
        data: [
            'BTC',
            // The element should be string type
            100,
            'NEO',
            'USDT'
        ]
    } as KuCoinListTradingMarkets
};
