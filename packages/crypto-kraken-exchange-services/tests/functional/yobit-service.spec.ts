import { expect } from 'chai';
import { Order, OrderType, YobitExchangeCredentials, YobitService } from '../../src';
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

    it('should get a zero balance correctly', async () => {
        const balance = await service.getBalance('dash', credentials);

        expect(balance.allAmount)
            .to.eql(balance.freeAmount)
            .to.eql(balance.lockedAmount)
            .to.eql(0);
    });

    it('should get create a buy order correctly with a zero balance', async () => {
        const order: Order = {
            pair: ['eth', 'btc'],
            orderType: OrderType.Buy,
            amount: 100,
            price: 1
        };
        try {
            await wait(100);
            await service.createOrder(order, credentials);
            expect.fail('The test should throw an exception');
        } catch (error) {
            expect(error).to.match(/insufficient/i);
        }
    });

    it('should get create a sell order correctly a zero balance', async () => {
        const order: Order = {
            pair: ['eth', 'btc'],
            orderType: OrderType.Sell,
            amount: 100,
            price: 1
        };
        try {
            await wait(100);
            await service.createOrder(order, credentials);
            expect.fail('The test should throw an exception');
        } catch (error) {
            expect(error).to.match(/insufficient/i);
        }
    });
});

const wait = (milliseconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};
