import { expect } from 'chai';
import { KuCoinResponseParser } from '../../../src/services/kucoin/kucoin-response-parser';
import { CurrencyPair, Order, OrderType, OrderBook } from '../../../src/core';
import recentDealOrdersData, { wrongData as wrongRecentDealOrdersData } from './data/recent-deal-orders.data';
import fullOrderBookData, { wrongData as wrongFullOrderBookData } from './data/full-order-book.data';

describe('KuCoin Response Parser', () => {
    let kuCoinResponseParser: KuCoinResponseParser;

    beforeEach(() => {
        kuCoinResponseParser = new KuCoinResponseParser();
    });

    it('should parse deal orders correctly', () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];
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

        const orders = kuCoinResponseParser.parseDealOrders(currencyPair, JSON.stringify(recentDealOrdersData[1]));
        expect(orders).to.eql(expectedOrders);
        expect(() => kuCoinResponseParser.parseDealOrders(currencyPair, JSON.stringify(wrongRecentDealOrdersData[0])))
            .to.throw(/isn't the deal order type/);
        expect(() => kuCoinResponseParser.parseDealOrders(currencyPair, JSON.stringify(wrongRecentDealOrdersData[1])))
            .to.throw(/SELL/);
        expect(() => kuCoinResponseParser.parseDealOrders(currencyPair, JSON.stringify(wrongRecentDealOrdersData[2])))
            .to.throw(/result/);
    });

    it('should parse a full order book correctly', () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];
        const expectedOrderBook: OrderBook = {
            buyOrders: [
                {
                    amount: 565,
                    price: 0.2,
                    orderType: OrderType.Buy,
                    pair: currencyPair

                },
                {
                    amount: 185,
                    price: 0.1,
                    orderType: OrderType.Buy,
                    pair: currencyPair
                }
            ],
            sellOrders: [
                {
                    amount: 345,
                    price: 0.52,
                    orderType: OrderType.Sell,
                    pair: currencyPair

                },
                {
                    amount: 10,
                    price: 0.5,
                    orderType: OrderType.Sell,
                    pair: currencyPair
                }
            ]
        };

        const orderBook = kuCoinResponseParser.parseOrderBook(currencyPair, JSON.stringify(fullOrderBookData[1]));
        expect(orderBook).to.eql(expectedOrderBook);
        expect(() => kuCoinResponseParser.parseOrderBook(currencyPair, JSON.stringify(wrongFullOrderBookData[0])))
            .to.throw(/isn't the order book type/);
        expect(() => kuCoinResponseParser.parseOrderBook(currencyPair, JSON.stringify(wrongFullOrderBookData[1])))
            .to.throw(/isn't the order book type/);
        expect(() => kuCoinResponseParser.parseOrderBook(currencyPair, JSON.stringify(wrongFullOrderBookData[2])))
            .to.throw(/isn't the order book type/);
    });
});