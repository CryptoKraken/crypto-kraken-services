import { YobitService } from '../../../src/services/yobit';
import * as nock from 'nock';
import { YOBIT_CONSTANTS } from '../../../src/services/yobit/constants';
import { orderBookRawResponse, orderBookParsed } from './data';
import { expect } from 'chai';
import { OrderType, OrderBook } from '../../../src/core';

describe('YoBit Exchange Service', () => {
    const getOrderBookUrlPostfix = `/${YOBIT_CONSTANTS.GET_ORDER_BOOK_METHOD_NAME}/ltc_btc`;
    let exchangeService: YobitService;

    beforeEach(() => {
        exchangeService = new YobitService();
    });

    it('should get an order book', async () => {
        nock(YOBIT_CONSTANTS.ROOT_API_URL)
            .get(getOrderBookUrlPostfix)
            .reply(200, JSON.stringify(orderBookRawResponse));

        const result = await exchangeService.getOrderBook(['ltc', 'btc']);
        expect(result).to.be.eql(orderBookParsed);
    });
    it('should get an order book with the second request (the first request causes an error)', async () => {
        nock(YOBIT_CONSTANTS.ROOT_API_URL)
            .get(getOrderBookUrlPostfix)
            .reply(500)
            .get(getOrderBookUrlPostfix)
            .reply(200, JSON.stringify(orderBookRawResponse));

        const result = await exchangeService.getOrderBook(['ltc', 'btc']);
        expect(result).to.be.eql(orderBookParsed);
    });
    it('should pass query parameters for getting an order book with applied maxLimit', async () => {
        nock(YOBIT_CONSTANTS.ROOT_API_URL)
            .get(getOrderBookUrlPostfix)
            .query({ limit: 4 })
            .reply(200, JSON.stringify(orderBookRawResponse));

        const result = await exchangeService.getOrderBook(['ltc', 'btc'], 4);
        expect(result).to.be.eql(orderBookParsed);
    });
});