import { expect } from 'chai';
import { YobitResponseParser } from '../../../src/services/yobit/yobit-response-parser';
import { balanceCases, orderBookCases, tradesCases, wrongBalanceCases, yobitGeneralError } from './data';

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
});
