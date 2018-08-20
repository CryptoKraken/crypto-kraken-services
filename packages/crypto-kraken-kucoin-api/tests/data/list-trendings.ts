import { KuCoinListTrendings } from '../../src';

export const listTrendingsCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/public-market-data/list-trendings(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531682372000,
        data: [
            {
                coinPair: 'BTM-BTC',
                deals: [
                    [1506049200000, null],
                    [1506045600000, null],
                    [1506042000000, null],
                    [1506038400000, 1260]
                ]
            }
        ]
    } as KuCoinListTrendings,
    ethNeoAndBtc: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531682372389,
        data: [
            {
                coinPair: 'ETH-BTC',
                deals: [
                    [1531681200000, 0.07092443],
                    [1531677600000, 0.07085507],
                    [1531674000000, 0.0706869]
                ]
            },
            {
                coinPair: 'NEO-BTC',
                deals: [
                    [1531681200000, 0.00526185],
                    [1531677600000, 0.00526788]
                ]
            }
        ]
    } as KuCoinListTrendings,
    // When the 'market' parameter of a request is incorrect or unknown
    withEmptyData: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531682177264,
        data: []
    } as KuCoinListTrendings
};

export const wrongListTrendingsCases = {
    withoutCoinPair: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531682372000,
        data: [
            {
                /* There isn't the coinPair field */
                deals: [
                    [1506049200000, null],
                    [1506045600000, null],
                    [1506042000000, null],
                    [1506038400000, 1260]
                ]
            }
        ]
    } as KuCoinListTrendings,
};
