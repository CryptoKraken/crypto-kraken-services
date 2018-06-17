import { OrderBook, OrderType } from '../../../../src/core';

/* tslint:disable */
export const orderBookCases = {
    /* This case from the KuCoin documentation: https://kucoinapidocs.docs.apiary.io/#reference/0/market/order-books(open) */
    default: {
        data: {
            "success": true,
            "code": "OK",
            "msg": "Operation succeeded.",
            "data": {
                "_comment": "arr[0]   Price arr[1]   Amount arr[2]   Volume",
                "SELL": [
                    [
                        20,
                        5,
                        100
                    ],
                    [
                        19,
                        5,
                        95
                    ]
                ],
                "BUY": [
                    [
                        18,
                        5,
                        90
                    ],
                    [
                        17,
                        5,
                        85
                    ]
                ]
            }
        },
        expected: <OrderBook>{
            sellOrders: [
                {
                    price: 20,
                    amount: 5,
                    orderType: OrderType.Sell,
                    pair: ['AAA', 'BBB']
                },
                {
                    price: 19,
                    amount: 5,
                    orderType: OrderType.Sell,
                    pair: ['AAA', 'BBB']
                }
            ],
            buyOrders: [
                {
                    price: 18,
                    amount: 5,
                    orderType: OrderType.Buy,
                    pair: ['AAA', 'BBB']
                },

                {
                    price: 17,
                    amount: 5,
                    orderType: OrderType.Buy,
                    pair: ['AAA', 'BBB']
                }
            ]
        }
    },
    dataAndAnyOtherField: {
        data: {
            field1: 'otherData',
            data: {
                'SELL': [
                    [
                        0.52,
                        345,
                        0.52 * 345
                    ],
                    [
                        0.5,
                        10,
                        0.5 * 10
                    ]
                ],
                'BUY': [
                    [
                        0.2,
                        565,
                        0.2 * 565
                    ],
                    [
                        0.1,
                        185,
                        0.1 * 185
                    ]
                ]
            }
        },
        expected: <OrderBook>{
            sellOrders: [
                {
                    price: 0.52,
                    amount: 345,
                    orderType: OrderType.Sell,
                    pair: ['AAA', 'BBB']
                },
                {
                    price: 0.5,
                    amount: 10,
                    orderType: OrderType.Sell,
                    pair: ['AAA', 'BBB']
                }
            ],
            buyOrders: [
                {
                    price: 0.2,
                    amount: 565,
                    orderType: OrderType.Buy,
                    pair: ['AAA', 'BBB']
                },
                {
                    price: 0.1,
                    amount: 185,
                    orderType: OrderType.Buy,
                    pair: ['AAA', 'BBB']
                }
            ]
        }
    }
};

export const wrongOrderBookCases = {
    sellOrderWithMissingPrice: {
        field1: 'otherData',
        data: {
            'SELL': [
                [
                    // Missing required element
                    0.52,
                    0.52 * 345
                ],
                [
                    0.5,
                    10,
                    0.5 * 10
                ]
            ],
            'BUY': [
                [
                    0.2,
                    565,
                    0.2 * 565
                ],
                [
                    0.1,
                    185,
                    0.1 * 185
                ]
            ]
        }
    },
    buyOrderWithMissingPrice: {
        field1: 'otherData',
        data: {
            'SELL': [
                [
                    0.52,
                    345,
                    0.52 * 345
                ],
                [
                    0.5,
                    10,
                    0.5 * 10
                ]
            ],
            'BUY': [
                [
                    0.2,
                    565,
                    0.2 * 565
                ],
                [
                    // Missing required element
                    0.1,
                    185
                ]
            ]
        }
    },
    dataWithWrongOrderTypeName: {
        field1: 'otherData',
        data: {
            'SELL': [
                [
                    0.52,
                    345,
                    0.52 * 345
                ],
                [
                    0.5,
                    10,
                    0.5 * 10
                ]
            ],
            // The field name is wrong, it should be either 'SELL' or 'BUY'
            'BUY1': [
                [
                    0.2,
                    565,
                    0.2 * 565
                ],
                [
                    0.1,
                    185,
                    0.1 * 185
                ]
            ]
        }
    }
};
