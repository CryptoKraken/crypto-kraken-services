import { expect } from 'chai';
import { Order, OrderType } from '../../../src';
import { YobitResponseParser } from '../../../src/services/yobit/yobit-response-parser';
import {
    balanceCases,
    createOrderCases,
    orderBookCases,
    tradesCases,
    wrongBalanceCases,
    wrongCreateOrderCases,
    yobitGeneralError
} from './data';

describe('Yobit Response Parser', () => {
    let parser: YobitResponseParser;

    beforeEach(() => {
        parser = new YobitResponseParser();
    });

    it('should parse an order book', () => {
        const result = parser.parseOrderBook(JSON.stringify(orderBookCases.default.data), ['ltc', 'btc']);
        expect(result).to.eql(orderBookCases.default.expected);

        expect(() => parser.parseOrderBook(JSON.stringify(yobitGeneralError), ['aaa', 'bbb']))
            .to.throw(/Yobit error text/);
        expect(() => parser.parseOrderBook(JSON.stringify(''), ['aaa', 'bbb']))
            .to.throw(/Data object is empty/);
        expect(() => parser.parseOrderBook(JSON.stringify({}), ['aaa', 'bbb']))
            .to.throw(/Data object does not have the .* property./);

        const asksBidsErrorRegex = /Data object does not have the asks or bids property./;
        expect(() => parser.parseOrderBook(JSON.stringify({ aaa_bbb: {} }), ['aaa', 'bbb']))
            .to.throw(asksBidsErrorRegex);
        expect(() => parser.parseOrderBook(JSON.stringify({ aaa_bbb: { asks: [] } }), ['aaa', 'bbb']))
            .to.throw(asksBidsErrorRegex);
        expect(() => parser.parseOrderBook(JSON.stringify({ aaa_bbb: { bids: [] } }), ['aaa', 'bbb']))
            .to.throw(asksBidsErrorRegex);
        expect(() => parser.parseOrderBook(
            JSON.stringify({ aaa_bbb: { asks: [[1]], bids: [[1, 2]] } }), ['aaa', 'bbb']))
            .to.throw(asksBidsErrorRegex);
    });

    it('should parse trades', () => {
        const result = parser.parseTrades(JSON.stringify(tradesCases.default.data), ['ltc', 'btc']);
        expect(result).to.eql(tradesCases.default.expected);

        expect(() => parser.parseTrades(JSON.stringify(yobitGeneralError), ['aaa', 'bbb']))
            .to.throw(/Yobit error text/);
        expect(() => parser.parseTrades(JSON.stringify(''), ['aaa', 'bbb']))
            .to.throw(/Data object is empty/);
        expect(() => parser.parseTrades(JSON.stringify({}), ['aaa', 'bbb']))
            .to.throw(/Data object does not have the .* property./);
    });

    it('should parse balance', () => {
        let result = parser.parseBalance(JSON.stringify(balanceCases.defaultLtcBalance.data), 'ltc');
        expect(result).to.eql(balanceCases.defaultLtcBalance.expect);

        result = parser.parseBalance(JSON.stringify(balanceCases.zeroLtcBalance.data), 'ltc');
        expect(result).to.eql(balanceCases.zeroLtcBalance.expect);

        result = parser.parseBalance(JSON.stringify(balanceCases.allLockedLtcBalance.data), 'ltc');
        expect(result).to.eql(balanceCases.allLockedLtcBalance.expect);

        result = parser.parseBalance(JSON.stringify(balanceCases.neverRefiledLtcBalance.data), 'ltc');
        expect(result).to.eql(balanceCases.neverRefiledLtcBalance.expect);

        expect(() => parser.parseBalance(JSON.stringify(yobitGeneralError), 'aaa'))
            .to.throw(/Yobit error text/);
        expect(() => parser.parseBalance(JSON.stringify(''), 'aaa'))
            .to.throw(/Data object is empty/);
        expect(() => parser.parseBalance(JSON.stringify(wrongBalanceCases.dataWithoutReturnField), 'aaa'))
            .to.throw(/.*return.*/);
        expect(() => parser.parseBalance(JSON.stringify(wrongBalanceCases.dataWithoutFundField), 'aaa'))
            .to.throw(/.*funds.*/);
        expect(() => parser.parseBalance(JSON.stringify(wrongBalanceCases.dataWithoutCurrencyInfoInFunds), 'ltc'))
            .to.throw(/.*ltc.*/);
        expect(() => {
            parser.parseBalance(JSON.stringify(wrongBalanceCases.dataWithoutCurrencyInfoInFundsInclOrders), 'ltc');
        })
            .to.throw(/.*ltc.*/);
    });

    it('should parse create order result', () => {
        const order: Order = { amount: 12, orderType: OrderType.Sell, pair: ['ltc', 'btc'], price: 100 };
        const result = parser.parseCreateOrder(
            JSON.stringify(createOrderCases.defaultSellLtcBtcWithPrice100Order.data),
            order);

        expect(result).to.eql(createOrderCases.defaultSellLtcBtcWithPrice100Order.expect);
        expect(() => parser.parseCreateOrder(JSON.stringify(yobitGeneralError), order))
            .to.throw(/Yobit error text/);
        expect(() => parser.parseCreateOrder(JSON.stringify(''), order))
            .to.throw(/Data object is empty/);
        expect(() => parser.parseCreateOrder(JSON.stringify(wrongCreateOrderCases.dataWithoutReturnField), order))
            .to.throw(/.*return.*/);
        expect(() => parser.parseCreateOrder(JSON.stringify(wrongCreateOrderCases.dataWithoutOrderIdField), order))
            .to.throw(/.*order_id.*/);
    });
});
