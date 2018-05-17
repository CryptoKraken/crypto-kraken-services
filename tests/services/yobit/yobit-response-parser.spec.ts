import { YobitResponseParser } from '../../../src/services/yobit/yobit-response-parser';
import { orderBookRawResponse, yobitGeneralError, orderBookParsed } from './data';
import { expect } from 'chai';
import { OrderType } from '../../../src/core';

describe('YoBit Response Parser', () => {
    let parser: YobitResponseParser;
    beforeEach(() => {
        parser = new YobitResponseParser();
    });
    it('should parse an order book', () => {
        const result = parser.parseOrderBook(JSON.stringify(orderBookRawResponse), ['ltc', 'btc']);
        expect(result).to.be.eql(orderBookParsed);

        expect(() => parser.parseOrderBook(JSON.stringify(yobitGeneralError), ['aaa', 'bbb']))
            .to.throw(/Yobit error text/);
        expect(() => parser.parseOrderBook(JSON.stringify(''), ['aaa', 'bbb']))
            .to.throw(/Data object is empty/);
        expect(() => parser.parseOrderBook(JSON.stringify({}), ['aaa', 'bbb']))
            .to.throw(/Data object does not have the .* property./);
    });
});