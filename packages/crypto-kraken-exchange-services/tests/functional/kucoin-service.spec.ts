import { expect } from 'chai';
import { Identified, KuCoinExchangeCredentials, KuCoinService, Order, OrderType } from '../../src/index';
import { testsConfig } from './tests.config';

describe('The KuCoin service', () => {
    let kuCoinService: KuCoinService;
    let kuCoinExchangeCredentials: KuCoinExchangeCredentials;
    const minLimit = 0;
    const maxLimit = 1000;

    before(() => {
        kuCoinService = new KuCoinService();
        kuCoinExchangeCredentials = {
            apiKey: testsConfig.exchangeCredentials.kuCoin.apiKey,
            secret: testsConfig.exchangeCredentials.kuCoin.secret
        };
    });

    it('should get an order book correctly', async () => {
        const orderBook = await kuCoinService.getOrderBook(['ETH', 'BTC']);

        expect(orderBook.buyOrders.length)
            .to.eql(orderBook.sellOrders.length)
            .to.eql(6);
    });

    it('should get an order book with min limit equaling 0', async () => {
        const orderBook = await kuCoinService.getOrderBook(['ETH', 'BTC'], minLimit);

        expect(orderBook.buyOrders.length)
            .to.eql(orderBook.sellOrders.length)
            .to.eql(0);
    });

    it('should get an order book with max limit equaling 100', async () => {
        const orderBook = await kuCoinService.getOrderBook(['ETH', 'BTC'], maxLimit);

        expect(orderBook.buyOrders.length)
            .to.eql(orderBook.sellOrders.length)
            .to.eql(100);
    });

    it('should get trades correctly', async () => {
        const trades = await kuCoinService.getTrades(['ETH', 'BTC']);
        expect(trades.length).to.eql(10);
    });

    it('should get trades with min limit equaling 10', async () => {
        const trades = await kuCoinService.getTrades(['ETH', 'BTC'], minLimit);
        expect(trades.length).to.eql(10);
    });

    it('should get trades with max limit equaling 50', async () => {
        const trades = await kuCoinService.getTrades(['ETH', 'BTC'], maxLimit);
        expect(trades.length).to.eql(50);
    });

    it('should get a balance of coin correctly', async () => {
        const balance = await kuCoinService.getBalance('BTC', kuCoinExchangeCredentials);

        expect(balance.allAmount)
            .to.eql(balance.freeAmount)
            .to.eql(balance.lockedAmount)
            .to.eql(0);
    });

    it.skip('should create an order and cancel it correctly', async () => {
        let identifiedOrder: Identified<Order> | undefined;
        try {
            const order: Order = {
                pair: { 0: 'ETH', 1: 'BTC' },
                orderType: OrderType.Buy,
                amount: 100,
                price: 1
            };
            identifiedOrder = await kuCoinService.createOrder(order, kuCoinExchangeCredentials);
            expect(identifiedOrder).to.include(order);
            expect(identifiedOrder.id).to.exist;
        } catch (error) {
            throw error;
        } finally {
            if (identifiedOrder)
                await kuCoinService.deleteOrder(identifiedOrder, kuCoinExchangeCredentials);
        }
    });

    it.skip('should get an order info correctly', async () => {
        let identifiedOrder: Identified<Order> | undefined;
        try {
            const order: Order = {
                pair: { 0: 'ETH', 1: 'BTC' },
                orderType: OrderType.Sell,
                amount: 10,
                price: 1
            };

            identifiedOrder = await kuCoinService.createOrder(order, kuCoinExchangeCredentials);
            const orderInfo = await kuCoinService.getOrderInfo(identifiedOrder, kuCoinExchangeCredentials);

            expect(identifiedOrder).to.eql(orderInfo.order);
            expect(orderInfo.remainingAmount).to.eql(orderInfo.order.amount);
            expect(orderInfo.executedAmount).to.eql(0);
        } catch (error) {
            throw error;
        } finally {
            if (identifiedOrder)
                await kuCoinService.deleteOrder(identifiedOrder, kuCoinExchangeCredentials);
        }
    });

    describe.skip('should throw an error when it get an wrong currency/currency pair', async () => {
        const wrongCurrencyPair = { 0: 'BTC', 1: 'ETH' };
        const operations: { [operationName: string]: () => Promise<any> } = {
            getOrderBook: async () => await kuCoinService.getOrderBook(wrongCurrencyPair),
            getTrades: async () => await kuCoinService.getTrades(wrongCurrencyPair),
            getBalance: async () => await kuCoinService.getBalance('wrong_currency', kuCoinExchangeCredentials),
            getActiveOrders:
                async () => await kuCoinService.getActiveOrders(wrongCurrencyPair, kuCoinExchangeCredentials)
        };

        Object.getOwnPropertyNames(operations).forEach(operationName => {
            it(`the operation === ${operationName}`, async () => {
                try {
                    await operations[operationName]();
                    expect.fail(`This operation (${operationName}) should throw an exception`);
                } catch (error) {
                    expect(error.statusCode).to.eql(false);
                    expect(error.code).to.eql('ERROR');
                    expect(error.msg).to.eql('SYMBOL NOT FOUND');
                }
            });
        });
    });
});
