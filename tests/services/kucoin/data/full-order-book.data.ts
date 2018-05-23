/* tslint:disable */
export default {
    /** This case from the KuCoin documentation: https://kucoinapidocs.docs.apiary.io/#reference/0/market/order-books(open) */
    0: {
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
    1: {
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
    }
};

export const wrongData = {
    0: {
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
    1: {
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
    2: {
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
