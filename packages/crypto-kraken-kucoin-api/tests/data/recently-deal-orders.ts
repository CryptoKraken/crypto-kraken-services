import { KuCoinRecentlyDealOrders } from 'src';

export const recentlyDealOrdersCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/public-market-data/recently-deal-orders(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1526450937000,
        data: [
            [
                1506037604000,
                'SELL',
                5210,
                48600633397,
                2532093
            ],
            [
                1506037604000,
                'SELL',
                5800,
                10227827586,
                593214
            ]
        ]
    } as KuCoinRecentlyDealOrders,
    ethAndBtc: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531678414242,
        data: [
            [
                1531678297000,
                'SELL',
                0.07047914,
                0.104592,
                0.00737155
            ],
            [
                1531678304000,
                'SELL',
                0.07047915,
                0.0196433,
                0.00138444
            ],
            [
                1531678305000,
                'BUY',
                0.07062539,
                0.0095266,
                0.00067282
            ],
            [
                1531678364000,
                'SELL',
                0.07047917,
                0.17,
                0.01198146
            ]
        ]
    } as KuCoinRecentlyDealOrders
};

export const wrongRecentlyDealOrdersCases = {
    withWrongOrders: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531678414242,
        data: [
            [
                1531678297000,
                /* Missing required element */
                0.07047914,
                0.104592,
                0.00737155
            ],
            [
                'Wrong element'
            ],
            [
                1531678305000,
                'BUY',
                0.07062539,
                /* Missing required element */
                0.00067282
            ],
            [
                1531678364000,
                'SELL',
                0.07047917,
                /* Missing required element */
                0.01198146
            ]
        ]
    } as any as KuCoinRecentlyDealOrders,
    oneOrderWithoutOrderType: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531678414242,
        data: [
            [
                1531678297000,
                'SELL',
                0.07047914,
                0.104592,
                0.00737155
            ],
            [
                1531678304000,
                'SELL',
                0.07047915,
                0.0196433,
                0.00138444
            ],
            [
                1531678305000,
                /* Missing required element */
                0.07062539,
                0.0095266,
                0.00067282
            ],
            [
                1531678364000,
                'SELL',
                0.07047917,
                0.17,
                0.01198146
            ]
        ]
    } as KuCoinRecentlyDealOrders,
    oneOrderWithoutPrice: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1531678414242,
        data: [
            [
                1531678297000,
                'SELL',
                0.07047914,
                0.104592,
                0.00737155
            ],
            [
                1531678304000,
                'SELL',
                0.07047915,
                0.0196433,
                0.00138444
            ],
            [
                1531678305000,
                'BUY',
                0.07062539,
                0.0095266,
                0.00067282
            ],
            [
                1531678364000,
                'SELL',
                /* Missing required element */
                0.17,
                0.01198146
            ]
        ]
    } as KuCoinRecentlyDealOrders
};
