import { expect } from 'chai';
import { KuCoinResponseParser } from '../../src/services/kucoin/kucoin-responce-parser';
import { CurrencyPair, Order, OrderType } from '../../src/core';

describe('KuCoin Responce Parser', () => {
    let kuCoinResponseParser: KuCoinResponseParser;

    beforeEach(() => {
        kuCoinResponseParser = new KuCoinResponseParser();
    });

    it('It should correct parse orders', () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];
        const dataCases = {
            0: {
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
            1: {
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
                        'SELL1',
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
            3: {
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
        const expectedOrders: Order[] = [
            {
                pair: currencyPair,
                orderType: OrderType.Buy,
                price: 0.5,
                amount: 10
            },
            {
                pair: currencyPair,
                orderType: OrderType.Sell,
                price: 0.52,
                amount: 345
            },
            {
                pair: currencyPair,
                orderType: OrderType.Buy,
                price: 0.1,
                amount: 185
            }
        ];

        const orders = kuCoinResponseParser.parseOrders(currencyPair, JSON.stringify(dataCases[0]));
        expect(orders).to.eql(expectedOrders);
        expect(() => kuCoinResponseParser.parseOrders(currencyPair, JSON.stringify(dataCases[1]))).to.throw(/isn't the order type/);
        expect(() => kuCoinResponseParser.parseOrders(currencyPair, JSON.stringify(dataCases[2]))).to.throw(/SELL/);
        expect(() => kuCoinResponseParser.parseOrders(currencyPair, JSON.stringify(dataCases[3]))).to.throw(/result/);
    });
});