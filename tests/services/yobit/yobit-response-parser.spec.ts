import { YobitResponseParser } from '../../../src/services/yobit/yobit-response-parser';
import { orderBookResponse, yobitGeneralError } from './data';
import { expect } from 'chai';
import { OrderType } from '../../../src/core';

describe('YoBit Response Parser', () => {
    let parser: YobitResponseParser;
    beforeEach(() => {
        parser = new YobitResponseParser();
    });
    it('should parse an order book', () => {
        const result = parser.parseOrderBook(JSON.stringify(orderBookResponse), ['ltc', 'btc']);
        expect(result.sellOrders.length).to.eql(2);
        expect(result.sellOrders[0].amount).to.eql(0.06);
        expect(result.sellOrders[0].price).to.eql(0.01665);
        expect(result.sellOrders[1].amount).to.eql(0.01);
        expect(result.sellOrders[1].price).to.eql(0.01461);
        expect(result.sellOrders[0].orderType)
            .to.eql(result.sellOrders[1].orderType)
            .to.eql(OrderType.Sell);
        expect(result.sellOrders[0].pair)
            .to.eql(result.sellOrders[1].pair)
            .to.eql(['ltc', 'btc']);

        expect(result.buyOrders.length).to.eql(2);
        expect(result.buyOrders[0].amount).to.eql(0.5);
        expect(result.buyOrders[0].price).to.eql(0.01673804);
        expect(result.buyOrders[1].amount).to.eql(1.1);
        expect(result.buyOrders[1].price).to.eql(0.01599042);
        expect(result.buyOrders[0].orderType)
            .to.eql(result.buyOrders[1].orderType)
            .to.eql(OrderType.Buy);
        expect(result.buyOrders[0].pair)
            .to.eql(result.buyOrders[1].pair)
            .to.eql(['ltc', 'btc']);

        expect(() => parser.parseOrderBook(JSON.stringify(yobitGeneralError), ['aaa', 'bbb']))
            .to.throw(/Yobit error text/);
        expect(() => parser.parseOrderBook(JSON.stringify(''), ['aaa', 'bbb']))
            .to.throw(/Data object is empty/);
        expect(() => parser.parseOrderBook(JSON.stringify({}), ['aaa', 'bbb']))
            .to.throw(/Data object does not have the .* property./);
    });
});