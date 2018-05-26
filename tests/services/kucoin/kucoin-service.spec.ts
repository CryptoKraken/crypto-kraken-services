import { expect } from 'chai';
import * as nock from 'nock';
import { CurrencyPair, Order, OrderType } from '../../../src/core';
import { KuCoinService } from '../../../src/services/kucoin';
import { KuCoinConstants } from '../../../src/services/kucoin/constants';
import { orderBookCases, tradesCases } from './data';

describe('KuCoin Exchange Service', () => {
    let kuCoinService: KuCoinService;

    beforeEach(() => {
        kuCoinService = new KuCoinService();
    });

    it('should get trades correctly', async () => {
        const currentCase = tradesCases.default;
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .twice()
            .reply(200, currentCase.data);

        const orders1 = await kuCoinService.getRecentDealOrders(currencyPair);
        const orders2 = await kuCoinService.getRecentDealOrders(currencyPair);

        expect(orders1)
            .to.eql(orders2)
            .to.eql(currentCase.expected);
    });

    it('should get trades despite the connection error', async () => {
        const currentCase = tradesCases.default;
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .replyWithError('An connection error from the test');
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, currentCase.data);

        const orders = await kuCoinService.getRecentDealOrders(currencyPair);

        expect(orders)
            .to.eql(currentCase.expected);
    });

    it('should get a order book', async () => {
        const currentCase = orderBookCases.default;
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .twice()
            .reply(200, currentCase.data);

        const orderBook1 = await kuCoinService.getOrderBook(currencyPair);
        const orderBook2 = await kuCoinService.getOrderBook(currencyPair);

        expect(orderBook1)
            .to.eql(orderBook2)
            .to.eql(currentCase.expected);
    });

    it('should get a full order book despite the connection error', async () => {
        const currentCase = orderBookCases.default;
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .replyWithError('An connection error from the test');
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, currentCase.data);

        const orderBook = await kuCoinService.getOrderBook(currencyPair);

        expect(orderBook)
            .to.eql(currentCase.expected);
    });
});
