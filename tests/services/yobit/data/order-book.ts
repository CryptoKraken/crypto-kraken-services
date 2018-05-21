import { OrderBook, OrderType } from "../../../../src/core";

export const orderBookCases = {
    default: {
        data: {
            ltc_btc: [
                {
                    type: 'ask',
                    price: 0.01665,
                    amount: 0.06,
                    tid: 200623735,
                    timestamp: 1526172281
                },
                {
                    type: 'bid',
                    price: 0.01673804,
                    amount: 0.5,
                    tid: 200623734,
                    timestamp: 1526172256
                },
                {
                    type: 'bid',
                    price: 0.01599042,
                    amount: 1.1,
                    tid: 200623732,
                    timestamp: 1526172121
                },
                {
                    type: 'ask',
                    price: 0.01461,
                    amount: 0.01,
                    tid: 200623731,
                    timestamp: 1526172282
                }
            ]
        },
        expected: <OrderBook>{
            sellOrders: [
                {
                    amount: 0.06,
                    price: 0.01665,
                    orderType: OrderType.Sell,
                    pair: ['ltc', 'btc']
                },
                {
                    amount: 0.01,
                    price: 0.01461,
                    orderType: OrderType.Sell,
                    pair: ['ltc', 'btc']
                }
            ],
            buyOrders: [
                {
                    amount: 0.5,
                    price: 0.01673804,
                    orderType: OrderType.Buy,
                    pair: ['ltc', 'btc']
                },
                {
                    amount: 1.1,
                    price: 0.01599042,
                    orderType: OrderType.Buy,
                    pair: ['ltc', 'btc']
                }
            ]
        }
    }
};