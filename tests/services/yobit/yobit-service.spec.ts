import { expect } from 'chai';
import * as nock from 'nock';
import { YobitService } from '../../../src/services/yobit';
import { YobitConstants } from '../../../src/services/yobit/constants';
import { orderBookCases, tradesCases } from './data';

describe('YoBit Exchange Service', () => {
    const orderBookPostfix = YobitConstants.getOrderBookUri(['ltc', 'btc']);
    const tradesUrlPostfix = YobitConstants.getTradesUri(['ltc', 'btc']);
    let exchangeService: YobitService;

    beforeEach(() => {
        exchangeService = new YobitService();
    });

    it('should get an order book', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(orderBookPostfix)
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc']);
        expect(result).to.eql(orderBookCases.default.expected);
    });

    it('should get an order book by the second request (the first request causes an error)', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(orderBookPostfix)
            .reply(500)
            .get(orderBookPostfix)
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc']);
        expect(result).to.eql(orderBookCases.default.expected);
    });

    it('should pass query parameters for getting an order book with applied maxLimit', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(orderBookPostfix)
            .query({ limit: 4 })
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc'], 4);
        expect(result).to.eql(orderBookCases.default.expected);
    });

    it('should get trades', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(tradesUrlPostfix)
            .reply(200, JSON.stringify(tradesCases.default.data));

        const result = await exchangeService.getTrades(['ltc', 'btc']);
        expect(result).to.eql(tradesCases.default.expected);
    });

    it('should get trades by the second request (the first request causes an error)', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(tradesUrlPostfix)
            .reply(500)
            .get(tradesUrlPostfix)
            .reply(200, JSON.stringify(tradesCases.default.data));

        const result = await exchangeService.getTrades(['ltc', 'btc']);
        expect(result).to.eql(tradesCases.default.expected);
    });

    it('should pass query parameters for getting trades with applied maxLimit', async () => {
        nock(YobitConstants.rootServerUrl)
            .get(tradesUrlPostfix)
            .query({ limit: 4 })
            .reply(200, JSON.stringify(tradesCases.default.data));

        const result = await exchangeService.getTrades(['ltc', 'btc'], 4);
        expect(result).to.eql(tradesCases.default.expected);
    });
});
