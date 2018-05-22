/* tslint:disable */
export default {
    /** This case from the KuCoin documentation: https://kucoinapidocs.docs.apiary.io/#reference/0/market/recently-deal-orders(open) */
    0: {
        "_comment": "arr[0]   Timestamp arr[1]   Order Type arr[2]   Price arr[3]   Amount arr[4]   Volume",
        "success": true,
        "code": "OK",
        "msg": "Operation succeeded.",
        "data": [
            [
                1506037604000,
                "SELL",
                5210,
                48600633397,
                2532093
            ],
            [
                1506037604000,
                "SELL",
                5800,
                10227827586,
                593214
            ]
        ]
    },
    1: {
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
};

export const wrongData = {
    0: {
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
    1: {
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
    2: {
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
