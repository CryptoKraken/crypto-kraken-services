import { OrderInfo, OrderType } from '../../../../src';

/* tslint:disable */
export const orderInfoCases = {
    /* This case from the KuCoin documentation: https://kucoinapidocs.docs.apiary.io/#reference/0/trading/order-details */
    default: {
        data: {
            "success": true,
            "code": "OK",
            "msg": "Operation succeeded.",
            "timestamp": 1508308350807,
            "data": {
                "coinType": "KCS",
                "dealValueTotal": 0.00938022,
                "dealPriceAverage": 0.0001009,
                "feeTotal": 2e-8,
                "userOid": "5969ddc96732d54312eb960e",
                "dealAmount": 0,
                "createdAt": 1508308340807,
                "dealOrders": {
                    "total": 709,
                    "firstPage": true,
                    "lastPage": false,
                    "datas": [
                        {
                            "amount": 1,
                            "dealValue": 0.0001009,
                            "fee": 1e-8,
                            "dealPrice": 0.0001009,
                            "feeRate": 0
                        },
                        {
                            "amount": 92.79323381,
                            "dealValue": 0.00927932,
                            "fee": 1e-8,
                            "dealPrice": 0.0001,
                            "feeRate": 0
                        }
                    ],
                    "currPageNo": 1,
                    "limit": 2,
                    "pageNos": 355
                },
                "coinTypePair": "BTC",
                "orderPrice": 0.0001067,
                "type": "SELL",
                "orderOid": "59e41cd69bd8d374c9956c75",
                "pendingAmount": 187.34
            }
        },
        expected: {
            order: {
                id: '59e41cd69bd8d374c9956c75',
                orderType: OrderType.Sell,
                pair: { 0: 'KCS', 1: 'BTC' },
                price: 0.0001067,
                amount: 896.34
            },
            createdDate: new Date(1508308340807),
            remainingAmount: 187.34,
            executedAmount: 709
        } as OrderInfo
    },
    withZeroRemainingAmount: {
        data: {            
            field1: 'otherData',
            success: true,
            code: 'OK',
            data: {
                coinType: 'AAA',
                dealValueTotal: 0.0,
                feeTotal: 0.0,
                userOid: '5969ddc96732d54312eb960e',
                dealAmount: 0.0,
                coinTypePair: 'BBB',
                type: 'SELL',
                orderOid: '5b26813af576fd2018168949',
                createdAt: 1529250107000,
                dealOrders: {
                    total: 0,
                    firstPage: true,
                    lastPage: false,
                    datas: [],
                    currPageNo: 1,
                    limit: 20,
                    pageNos: 1
                },
                dealPriceAverage: 0.0,
                orderPrice: 1.0,
                pendingAmount: 10.0
            }
        },
        expected: {
            order: {
                id: '5b26813af576fd2018168949',
                orderType: OrderType.Sell,
                pair: { 0: 'AAA', 1: 'BBB' },
                price: 1,
                amount: 10
            },
            createdDate: new Date(1529250107000),
            remainingAmount: 10,
            executedAmount: 0
        } as OrderInfo
    }
};

export const wrongOrderInfoCases = {
    withMissingDatas: {
        field1: 'otherData',
        success: true,
        code: 'OK',
        data: {
            coinType: 'AAA',
            dealValueTotal: 0.0,
            feeTotal: 0.0,
            userOid: '5969ddc96732d54312eb960e',
            dealAmount: 0.0,
            coinTypePair: 'BBB',
            type: 'SELL',
            orderOid: '5b26813af576fd2018168949',
            createdAt: 1529250107000,
            dealOrders: {
                total: 0,
                firstPage: true,
                lastPage: false,
                // There isn't the required datas field
                currPageNo: 1,
                limit: 20,
                pageNos: 1
            },
            dealPriceAverage: 0.0,
            orderPrice: 1.0,
            pendingAmount: 10.0
        }
    }
};
