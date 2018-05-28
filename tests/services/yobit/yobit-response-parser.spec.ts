import { expect } from 'chai';
import { OrderType } from '../../../src/core';
import { YobitResponseParser } from '../../../src/services/yobit/yobit-response-parser';
import { tradesCases, yobitGeneralError } from './data';

describe('YoBit Response Parser', () => {
    let parser: YobitResponseParser;

    beforeEach(() => {
        parser = new YobitResponseParser();
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
