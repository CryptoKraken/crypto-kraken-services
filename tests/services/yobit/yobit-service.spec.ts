import { YobitService } from '../../../src/services/yobit';
import * as nock from 'nock';
import { YobitConstants } from '../../../src/services/yobit/constants';
import { orderBookCases } from './data';
import { expect } from 'chai';
import { OrderType, OrderBook, CurrencyPair } from '../../../src/core';

describe('YoBit Exchange Service', () => {
    const orderBookUrlPostfix = YobitConstants.getOrderBookUri(['ltc', 'btc']);
    let exchangeService: YobitService;

    beforeEach(() => {
        exchangeService = new YobitService();
    });

    it('should get an order book', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(orderBookUrlPostfix)
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc']);
        expect(result).to.be.eql(orderBookCases.default.expected);
    });

    it('should get an order book with the second request (the first request causes an error)', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(orderBookUrlPostfix)
            .reply(500)
            .get(orderBookUrlPostfix)
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc']);
        expect(result).to.be.eql(orderBookCases.default.expected);
    });

    it('should pass query parameters for getting an order book with applied maxLimit', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(orderBookUrlPostfix)
            .query({ limit: 4 })
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc'], 4);
        expect(result).to.be.eql(orderBookCases.default.expected);
    });
});