/* tslint:disable */
import { OrderBook, OrderType } from '../../../../src/core';

export const orderBookCases = {
    default: {
        data: {
            ltc_btc: {
                asks: [
                    [0.01571419, 1.7514179],
                    [0.01577619, 0.32323747]
                ],
                bids: [
                    [0.01567506, 2.94061013],
                    [0.01567505, 165.875],
                ]
            }
        },
        expected: <OrderBook>{
            sellOrders: [
                {
                    price: 0.01571419,
                    amount: 1.7514179,
                    orderType: OrderType.Sell,
                    pair: ['ltc', 'btc']
                },
                {
                    price: 0.01577619,
                    amount: 0.32323747,
                    orderType: OrderType.Sell,
                    pair: ['ltc', 'btc']
                }
            ],
            buyOrders: [
                {
                    price: 0.01567506,
                    amount: 2.94061013,
                    orderType: OrderType.Buy,
                    pair: ['ltc', 'btc']
                },
                {
                    price: 0.01567505,
                    amount: 165.875,
                    orderType: OrderType.Buy,
                    pair: ['ltc', 'btc']
                }
            ]
        }
    }
};
