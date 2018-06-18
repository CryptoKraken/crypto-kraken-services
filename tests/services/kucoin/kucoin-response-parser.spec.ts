import { expect } from 'chai';
import { CurrencyPair, Order, OrderType } from '../../../src/core';
import { KuCoinResponseParser } from '../../../src/services/kucoin/kucoin-response-parser';
import {
    activeOrderCases, createOrderCases, currencyBalancesCases,
    deleteOrderCases, orderBookCases, orderInfoCases,
    tradesCases,
    wrongActiveOrderCases,
    wrongCommonCases,
    wrongCreateOrderCases,
    wrongDeleteOrderCases,
    wrongOrderBookCases,
    wrongOrderInfoCases,
    wrongTradesCases
} from './data';
import { commonCases } from './data/common';
import { wrongCurrencyBalancesBalances } from './data/currency-balances';

describe('KuCoin Response Parser', () => {
    let kuCoinResponseParser: KuCoinResponseParser;

    beforeEach(() => {
        kuCoinResponseParser = new KuCoinResponseParser();
    });

    it('should parse trades correctly', () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        const orders = kuCoinResponseParser.parseTrades(
            JSON.stringify(tradesCases.mixedOrders.data), currencyPair
        );

        expect(orders).to.eql(tradesCases.mixedOrders.expected);
        expect(() => kuCoinResponseParser.parseTrades(
            JSON.stringify(wrongTradesCases.sellOrderWithMissingAmount), currencyPair)
        ).to.throw(/isn't the trade type/);
        expect(() => kuCoinResponseParser.parseTrades(
            JSON.stringify(wrongTradesCases.orderWithWrongOrderTypeName), currencyPair)
        ).to.throw(/SELL/);
        expect(() => kuCoinResponseParser.parseTrades(
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

    it('should parse a created order correctly', () => {
        const order: Order = {
            pair: ['AAA', 'CCC'],
            orderType: OrderType.Sell,
            price: 0.845,
            amount: 345
        };

        const createdOrder = kuCoinResponseParser.parseCreatedOrder(
            JSON.stringify(createOrderCases.dataAndAnyOtherField.data), order
        );
        expect(createdOrder).to.eql(createOrderCases.dataAndAnyOtherField.expected);
        expect(() => kuCoinResponseParser.parseCreatedOrder(
            JSON.stringify(wrongCreateOrderCases.dataWithoutOid), order)
        ).to.throw(/isn't the order type/);
    });

    it('should parse a deleted order correctly', () => {
        kuCoinResponseParser.parseDeletedOrder(
            JSON.stringify(deleteOrderCases.default.data)
        );

        expect(() => kuCoinResponseParser.parseDeletedOrder(
            JSON.stringify(commonCases.error.data)
        )).to.throw(commonCases.error.data.msg);
        expect(() => kuCoinResponseParser.parseDeletedOrder(
            JSON.stringify(wrongDeleteOrderCases.dataWithBody))
        ).to.throw(/isn't a KuCoin response result/);
    });

    it('should parse active orders correctly', () => {
        expect(kuCoinResponseParser.parseActiveOrders(
            JSON.stringify(activeOrderCases.default.data), ['AAA', 'BBB']
        )).to.eql(activeOrderCases.default.expected);
        expect(kuCoinResponseParser.parseActiveOrders(
            JSON.stringify(activeOrderCases.buyAndSellOrders.data), ['AAA', 'CCC']
        )).to.eql(activeOrderCases.buyAndSellOrders.expected);
        expect(() => kuCoinResponseParser.parseActiveOrders(
            JSON.stringify(commonCases.error.data), ['AAA', 'BBB']
        )).to.throw(commonCases.error.data.msg);

        expect(() => kuCoinResponseParser.parseActiveOrders(
            JSON.stringify(wrongCommonCases.responseWithoutData), ['AAA', 'BBB']
        )).to.throw(/hasn't got the 'data' field/);
        expect(() => kuCoinResponseParser.parseActiveOrders(
            JSON.stringify(wrongActiveOrderCases.dataWithMissingOrderTypes), ['AAA', 'BBB']
        )).to.throw(/doesn't contain active orders/);
        expect(() => kuCoinResponseParser.parseActiveOrders(
            JSON.stringify(wrongActiveOrderCases.dataWithOneWrongOrder), ['AAA', 'BBB']
        )).to.throw(/doesn't contain active orders/);
    });

    it('should parse a currency balance correctly', () => {
        const currencies = { BTC: 'BTC', AAA: 'AAA', BBB: 'BBB' };

        expect(kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(currencyBalancesCases.default.data), currencies.BTC
        )).to.eql(currencyBalancesCases.default.expected);

        expect(kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(currencyBalancesCases.dataAndAnyOtherField.data), currencies.AAA
        )).to.eql(currencyBalancesCases.dataAndAnyOtherField.expected);

        expect(kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(currencyBalancesCases.zeroBalance.data), currencies.BBB
        )).to.eql(currencyBalancesCases.zeroBalance.expected);

        expect(() => kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(currencyBalancesCases.default.data), currencies.BBB
        )).to.throw(/requested coin type does not correspond/);

        expect(() => kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(wrongCurrencyBalancesBalances.balanceWithoutAllAmount), currencies.AAA
        )).to.throw(/isn't the currency balance type/);

        expect(() => kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(wrongCurrencyBalancesBalances.balanceWithoutCoinType), currencies.AAA
        )).to.throw(/isn't the currency balance type/);

        expect(() => kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(wrongCurrencyBalancesBalances.balanceWithoutFreezeAmount), currencies.AAA
        )).to.throw(/isn't the currency balance type/);

        expect(() => kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(wrongCurrencyBalancesBalances.balanceWithWrongAllAmountType), currencies.AAA
        )).to.throw(/isn't the currency balance type/);

        expect(() => kuCoinResponseParser.parseCurrencyBalance(
            JSON.stringify(wrongCurrencyBalancesBalances.balanceWithWrongFreezeAmountType), currencies.AAA
        )).to.throw(/isn't the currency balance type/);
    });

    it('should parse an order info correctly', () => {
        expect(kuCoinResponseParser.parseOrderInfo(
            JSON.stringify(orderInfoCases.default.data)
        )).to.eql(orderInfoCases.default.expected);

        expect(kuCoinResponseParser.parseOrderInfo(
            JSON.stringify(orderInfoCases.withZeroRemainingAmount.data)
        )).to.eql(orderInfoCases.withZeroRemainingAmount.expected);

        expect(() => kuCoinResponseParser.parseOrderInfo(
            JSON.stringify(commonCases.error.data)
        )).to.throw(commonCases.error.data.msg);

        expect(() => kuCoinResponseParser.parseOrderInfo(
            JSON.stringify(wrongOrderInfoCases.withMissingDatas)
        )).to.throw(/doesn't contain an order info/);
    });
});
