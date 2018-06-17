import { expect } from 'chai';
import { YobitExchangeCredentials, YobitService } from '../../src';
import { testsConfig } from './tests.config';

describe('The Yobit service', () => {
    let service: YobitService;
    let credentials: YobitExchangeCredentials;

    before(() => {
        service = new YobitService();
        service.requestTryCount = 0;
        credentials = {
            apiKey: testsConfig.exchangeCredentials.yobit.apiKey,
            secret: testsConfig.exchangeCredentials.yobit.secret
        };
    });

    it('should get an order book correctly', async () => {
        const orderBook = await service.getOrderBook(['eth', 'btc']);

        expect(orderBook.buyOrders.length).to.eql(150);
        expect(orderBook.sellOrders.length).to.eql(150);
    });

    it('should get an order book with max limit equaling 1', async () => {
        const orderBook = await service.getOrderBook(['eth', 'btc'], 1);

        expect(orderBook.buyOrders.length).to.eql(1);
        expect(orderBook.sellOrders.length).to.eql(1);
    });

    it('should get trades correctly', async () => {
        const trades = await service.getTrades(['eth', 'btc']);

        expect(trades.length).to.eql(150);
    });

    it('should get trades correctly with max limit equaling 1', async () => {
        const trades = await service.getTrades(['eth', 'btc'], 1);

        expect(trades.length).to.eql(1);
    });
});
