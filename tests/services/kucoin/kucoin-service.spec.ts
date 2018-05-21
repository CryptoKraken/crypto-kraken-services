import { expect } from 'chai';
import * as nock from 'nock';
import { CurrencyPair, Order, OrderType } from '../../../src/core';
import { KuCoinService } from '../../../src/services/kucoin';
import { KuCoinConstants } from '../../../src/services/kucoin/constants';
import recentDealOrdersData from './data/recent-deal-orders.data';
import fullOrderBookData from './data/full-order-book.data';

describe('KuCoin Exchange Service', () => {
    let kuCoinService: KuCoinService;

    beforeEach(() => {
        kuCoinService = new KuCoinService();
    });

    it('should get recent deal orders', async () => {
        const currentCase = recentDealOrdersData[0];
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .twice()
            .reply(200, currentCase);

        const orders1 = await kuCoinService.getRecentDealOrders(currencyPair);
        const orders2 = await kuCoinService.getRecentDealOrders(currencyPair);

        expect(orders1.length)
            .to.eql(orders2.length)
            .to.eql(currentCase.data.length);
        expect(orders1).to.eql(orders2);
        expect(orders1[0].amount).to.eql(currentCase.data[0][3]);
        expect(orders1[0].orderType).to.eql(OrderType.Sell);
        expect(orders1[0].price).to.eql(currentCase.data[0][2]);
        expect(orders1[0].pair).to.eql(currencyPair);
        expect(currentCase.data[0][1]).to.eql('SELL');

        expect(orders2[1].amount).to.eql(currentCase.data[1][3]);
        expect(orders2[1].price).to.eql(currentCase.data[1][2]);
        expect(orders2[1].pair).to.eql(currencyPair);
        expect(orders2[1].orderType).to.eql(OrderType.Sell);
        expect(currentCase.data[1][1]).to.eql('SELL');
    });

    it('should get recent deal orders despite the connection error', async () => {
        const currentCase = recentDealOrdersData[0];
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
            .reply(200, currentCase);

        const orders = await kuCoinService.getRecentDealOrders(currencyPair);

        expect(orders[1].amount).to.eql(currentCase.data[1][3]);
        expect(orders[1].pair).to.eql(currencyPair);
        expect(orders[1].price).to.eql(currentCase.data[1][2]);
        expect(orders[1].orderType).to.eql(OrderType.Sell);
        expect(currentCase.data[1][1]).to.eql('SELL');
    });

    it('should get a full order book', async () => {
        const currentCase = fullOrderBookData[0];
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .twice()
            .reply(200, currentCase);

        const orderBook1 = await kuCoinService.getOrderBook(currencyPair);
        const orderBook2 = await kuCoinService.getOrderBook(currencyPair);

        expect(orderBook1.buyOrders.length)
            .to.eql(orderBook2.buyOrders.length)
            .to.eql(currentCase.data.BUY.length);
        expect(orderBook1.sellOrders.length)
            .to.eql(orderBook2.sellOrders.length)
            .to.eql(currentCase.data.SELL.length);

        expect(orderBook1.buyOrders[1].amount).to.eql(currentCase.data.BUY[1][1]);
        expect(orderBook1.buyOrders[1].orderType).to.eql(OrderType.Buy);
        expect(orderBook1.buyOrders[1].pair).to.eql(currencyPair);
        expect(orderBook1.buyOrders[1].price).to.eql(currentCase.data.BUY[1][0]);

        expect(orderBook2.buyOrders[0].amount).to.eql(currentCase.data.BUY[0][1]);
        expect(orderBook2.buyOrders[0].orderType).to.eql(OrderType.Buy);
        expect(orderBook2.buyOrders[0].pair).to.eql(currencyPair);
        expect(orderBook2.buyOrders[0].price).to.eql(currentCase.data.BUY[0][0]);

        expect(orderBook1.sellOrders[0].amount).to.eql(currentCase.data.SELL[0][1]);
        expect(orderBook1.sellOrders[0].orderType).to.eql(OrderType.Sell);
        expect(orderBook1.sellOrders[0].pair).to.eql(currencyPair);
        expect(orderBook1.sellOrders[0].price).to.eql(currentCase.data.SELL[0][0]);

        expect(orderBook2.sellOrders[1].amount).to.eql(currentCase.data.SELL[1][1]);
        expect(orderBook2.sellOrders[1].orderType).to.eql(OrderType.Sell);
        expect(orderBook2.sellOrders[1].pair).to.eql(currencyPair);
        expect(orderBook2.sellOrders[1].price).to.eql(currentCase.data.SELL[1][0]);
    });

    it('should get a full order book despite the connection error', async () => {
        const currentCase = fullOrderBookData[0];
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
            .reply(200, currentCase);

        const orderBook = await kuCoinService.getOrderBook(currencyPair);

        expect(orderBook.buyOrders.length)
            .to.eql(currentCase.data.BUY.length);
        expect(orderBook.sellOrders.length)
            .to.eql(currentCase.data.SELL.length);

        expect(orderBook.buyOrders[0].amount).to.eql(currentCase.data.BUY[0][1]);
        expect(orderBook.buyOrders[0].orderType).to.eql(OrderType.Buy);
        expect(orderBook.buyOrders[0].pair).to.eql(currencyPair);
        expect(orderBook.buyOrders[0].price).to.eql(currentCase.data.BUY[0][0]);

        expect(orderBook.sellOrders[0].amount).to.eql(currentCase.data.SELL[0][1]);
        expect(orderBook.sellOrders[0].orderType).to.eql(OrderType.Sell);
        expect(orderBook.sellOrders[0].pair).to.eql(currencyPair);
        expect(orderBook.sellOrders[0].price).to.eql(currentCase.data.SELL[0][0]);
    });
});
