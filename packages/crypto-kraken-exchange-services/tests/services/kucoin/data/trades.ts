import { Order, OrderType } from '../../../../src/core';

/* tslint:disable */
export const tradesCases = {
    /** This case from the KuCoin documentation: https://kucoinapidocs.docs.apiary.io/#reference/0/market/recently-deal-orders(open) */
    default: {
        data: {
            "_comment": "arr[0]   Timestamp arr[1]   Order Type arr[2]   Price arr[3]   Amount arr[4]   Volume",
            "success": true,
            "code": "OK",
            "msg": "Operation succeeded.",
            "data": [
                [
                    1506037604000,
                    "SELL",
                    5210,
                    486.00633397,
                    2532093
                ],
                [
                    1506037604000,
                    "SELL",
                    5800,
                    102.27827586,
                    593214
                ]
            ]
        },
        expected: <Order[]>[
            {
                orderType: OrderType.Sell,
                price: 5210,
                amount: 486.00633397,
                pair: ['AAA', 'BBB']
            },
            {
                orderType: OrderType.Sell,
                price: 5800,
                amount: 102.27827586,
                pair: ['AAA', 'BBB']
            }
        ]
    },
    mixedOrders: {
        data: {
            field1: 'otherData',
            data: [
                [
                    2521129900000,
                    'BUY',
                    0.5,
                    10,
                    0.5 * 10
                ],
                [
                    2521129900010,
                    'SELL',
                    0.52,
                    345,
                    0.52 * 345
                ],
                [
                    2483438000040,
                    'BUY',
                    0.1,
                    185,
                    0.1 * 185
                ]
            ]
        },
        expected: <Order[]>[
            {
                orderType: OrderType.Buy,
                price: 0.5,
                amount: 10,
                pair: ['AAA', 'BBB']
            },
            {
                orderType: OrderType.Sell,
                price: 0.52,
                amount: 345,
                pair: ['AAA', 'BBB']
            },
            {
                orderType: OrderType.Buy,
                price: 0.1,
                amount: 185,
                pair: ['AAA', 'BBB']
            }
        ]
    }
};

export const wrongTradesCases = {
    sellOrderWithMissingAmount: {
        data: [
            [
                2521129900000,
                'BUY',
                0.5,
                10,
                0.5 * 10
            ],
            [
                // Missing required element
                2521129900010,
                'SELL',
                0.52,
                0.52 * 345
            ],
            [
                2483438000040,
                'BUY',
                0.1,
                185,
                0.1 * 185
            ]
        ]
    },
    orderWithWrongOrderTypeName: {
        field: 'data',
        data: [
            [
                2521129900000,
                'BUY',
                0.5,
                10,
                0.5 * 10
            ],
            [
                2521129900010,
                'SELL1', // A wrong value, it should be either 'SELL' or 'BUY'
                0.52,
                345,
                0.52 * 345
            ],
            [
                2483438000040,
                'BUY',
                0.1,
                185,
                0.1 * 185
            ]
        ]
    },
    wrongDataFieldName: {
        // The field name is wrong. It should be named 'data'
        orders: [
            [
                2483438000040,
                'BUY',
                0.1,
                185,
                0.1 * 185
            ]
        ]
    }
};
