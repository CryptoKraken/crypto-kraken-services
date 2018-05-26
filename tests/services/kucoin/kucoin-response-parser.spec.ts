import { expect } from 'chai';
import { CurrencyPair, Order, OrderBook, OrderType } from '../../../src/core';
import { KuCoinResponseParser } from '../../../src/services/kucoin/kucoin-response-parser';
import { orderBookCases, tradesCases, wrongOrderBookCases, wrongTradesCases } from './data';

describe('KuCoin Response Parser', () => {
    let kuCoinResponseParser: KuCoinResponseParser;

    beforeEach(() => {
        kuCoinResponseParser = new KuCoinResponseParser();
    });

    it('should parse trades correctly', () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        const orders = kuCoinResponseParser.parseDealOrders(
            JSON.stringify(tradesCases.mixedOrders.data), currencyPair
        );

        expect(orders).to.eql(tradesCases.mixedOrders.expected);
        expect(() => kuCoinResponseParser.parseDealOrders(
            JSON.stringify(wrongTradesCases.sellOrderWithMissingAmount), currencyPair)
        ).to.throw(/isn't the deal order type/);
        expect(() => kuCoinResponseParser.parseDealOrders(
            JSON.stringify(wrongTradesCases.orderWithWrongOrderTypeName), currencyPair)
        ).to.throw(/SELL/);
        expect(() => kuCoinResponseParser.parseDealOrders(
            JSON.stringify(wrongTradesCases.wrongDataFieldName), currencyPair)
        ).to.throw(/result/);
    });

    it('should parse a order book correctly', () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        const orderBook = kuCoinResponseParser.parseOrderBook(
            JSON.stringify(orderBookCases.dataAndAnyOtherField.data), currencyPair
        );

        expect(orderBook).to.eql(orderBookCases.dataAndAnyOtherField.expected);
        expect(() => kuCoinResponseParser.parseOrderBook(
            JSON.stringify(wrongOrderBookCases.sellOrderWithMissingPrice), currencyPair)
        ).to.throw(/isn't the order book type/);
        expect(() => kuCoinResponseParser.parseOrderBook(
            JSON.stringify(wrongOrderBookCases.buyOrderWithMissingPrice), currencyPair)
        ).to.throw(/isn't the order book type/);
        expect(() => kuCoinResponseParser.parseOrderBook(
            JSON.stringify(wrongOrderBookCases.dataWithWrongOrderTypeName), currencyPair)
        ).to.throw(/isn't the order book type/);
    });
});
