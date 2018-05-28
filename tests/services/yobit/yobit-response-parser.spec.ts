import { expect } from 'chai';
import { OrderType } from '../../../src/core';
import { YobitResponseParser } from '../../../src/services/yobit/yobit-response-parser';
import { orderBookCases, tradesCases, yobitGeneralError } from './data';

describe('YoBit Response Parser', () => {
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

        const asksBidsErrorRegex = /Data object does not have the.*asks or bids.*property./;
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
});
