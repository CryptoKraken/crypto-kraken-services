import { Order, OrderType } from '../../../../src/core';
import { Identified } from '../../../../src/utils';

/* tslint:disable */
export const activeOrderCases = {
    default: {
        data: {
            "_comment": "arr[0] Time  arr[1] Order Type arr[2] Price arr[3] Amount arr[4]   Deal Amount arr[5] OrderOid",
            "success": true,
            "code": "OK",
            "data": {
                "SELL": [],
                "BUY": [
                    [
                        1499563694000,
                        "BUY",
                        38,
                        5,
                        0,
                        "596186ad07015679730ffa02"
                    ],
                    [
                        1499563686000,
                        "BUY",
                        35,
                        5,
                        0,
                        "596186a007015679730ffa01"
                    ],
                    [
                        1499563699000,
                        "BUY",
                        22,
                        5,
                        0,
                        "596186b207015679730ffa03"
                    ]
                ]
            }
        },
        expected: [
            {
                id: "596186ad07015679730ffa02",
                pair: ['AAA', 'BBB'],
                orderType: OrderType.Buy,
                price: 38,
                amount: 5
            },
            {
                id: "596186a007015679730ffa01",
                pair: ['AAA', 'BBB'],
                orderType: OrderType.Buy,
                price: 35,
                amount: 5
            },
            {
                id: "596186b207015679730ffa03",
                pair: ['AAA', 'BBB'],
                orderType: OrderType.Buy,
                price: 22,
                amount: 5
            },
        ] as Array<Identified<Order>>
    },
    error: {
        data: {
            success: false,
            code: 'ERROR',
            msg: 'Some error'
        }
    },
    buyAndSellOrders: {
        data: {
            success: true,
            code: 'OK',
            field1: 'otherData',
            data: {
                SELL: [
                    [
                        1499563692100,
                        'SELL',
                        0.8,
                        50,
                        0,
                        '11c0fc0243351701298a4330'
                    ]
                ],
                BUY: [
                    [
                        1499563692000,
                        'BUY',
                        0.5,
                        100,
                        0,
                        '11c0fc0243351701298a5637'
                    ],
                    [
                        1499563682200,
                        'BUY',
                        0.45,
                        140,
                        0,
                        '11c0fc0243351701298a5638'
                    ],
                    [
                        1499563630000,
                        'BUY',
                        0.3,
                        500,
                        0,
                        '11c0fc0243351701298a5639'
                    ]
                ]
            }
        },
        expected: [
            {
                id: "11c0fc0243351701298a4330",
                pair: ['AAA', 'CCC'],
                orderType: OrderType.Sell,
                price: 0.8,
                amount: 50
            },
            {
                id: "11c0fc0243351701298a5637",
                pair: ['AAA', 'CCC'],
                orderType: OrderType.Buy,
                price: 0.5,
                amount: 100
            },
            {
                id: "11c0fc0243351701298a5638",
                pair: ['AAA', 'CCC'],
                orderType: OrderType.Buy,
                price: 0.45,
                amount: 140
            },
            {
                id: "11c0fc0243351701298a5639",
                pair: ['AAA', 'CCC'],
                orderType: OrderType.Buy,
                price: 0.3,
                amount: 500
            },
        ] as Array<Identified<Order>>
    }
};

export const wrongActiveOrderCases = {
    dataWithMissingOrderTypes: {
        success: true,
        code: 'OK',
        field1: 'otherData',
        data: [
            [1499563692100,
                'SELL',
                0.8,
                50,
                0,
                '11c0fc0243351701298a4330'
            ],
            [
                1499563692000,
                'BUY',
                0.5,
                100,
                0,
                '11c0fc0243351701298a5637'
            ]
        ]
    },
    dataWithOneWrongOrder: {
        success: true,
        code: 'OK',
        field1: 'otherData',
        data: {
            SELL: [
                [
                    1499563692100,
                    'SELL',
                    0.8,
                    50,
                    0,
                    '11c0fc0243351701298a4330'
                ]
            ],
            BUY: [
                [
                    1499563692000,
                    'BUY',
                    0.5,
                    // Missing the amount field
                    0,
                    '11c0fc0243351701298a5637'
                ]
            ]
        }
    }
};
