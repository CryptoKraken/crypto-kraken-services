import { expect } from 'chai';
import * as nock from 'nock';
import { CurrencyPair, Order, OrderType } from '../../../src/core';
import { KuCoinService } from '../../../src/services/kucoin';
import { KuCoinConstants } from '../../../src/services/kucoin/constants';
import { KuCoinAuthRequestHeaders } from '../../../src/services/kucoin/kucoin-exchange-credentials';
import {
    createOrderCases, currencyBalancesCases,
    deleteOrderCases, exchangeCredentialsCases,
    orderBookCases, tradesCases
} from './data';

describe('KuCoin Exchange Service', () => {
    let kuCoinService: KuCoinService;

    const isHeaderHasValueRegEx = /./;
    const getNockAuthHeaders = (expectedAuthHeaderValues?: Partial<KuCoinAuthRequestHeaders>): {
        [K in keyof KuCoinAuthRequestHeaders]: string | RegExp | ((headerValue: string) => boolean)
    } => ({
        'KC-API-KEY': (expectedAuthHeaderValues && expectedAuthHeaderValues['KC-API-KEY']) || isHeaderHasValueRegEx,
        'KC-API-NONCE': (expectedAuthHeaderValues && expectedAuthHeaderValues['KC-API-NONCE']
            && expectedAuthHeaderValues['KC-API-NONCE']!.toString()) || /\d+/,
        'KC-API-SIGNATURE': (expectedAuthHeaderValues && expectedAuthHeaderValues['KC-API-SIGNATURE'])
            || isHeaderHasValueRegEx
    });

    beforeEach(() => {
        kuCoinService = new KuCoinService();
    });

    it('should get trades correctly', async () => {
        const currentCase = tradesCases.default;
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.tradesUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .twice()
            .reply(200, currentCase.data);

        const orders1 = await kuCoinService.getTrades(currencyPair);
        const orders2 = await kuCoinService.getTrades(currencyPair);

        expect(orders1)
            .to.eql(orders2)
            .to.eql(currentCase.expected);
    });

    it('should get trades despite the connection error', async () => {
        const currentCase = tradesCases.default;
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.tradesUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .replyWithError('An connection error from the test');
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.tradesUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, currentCase.data);

        const orders = await kuCoinService.getTrades(currencyPair);

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

    it('should get a balance of coin', async () => {
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.getBalanceOfCoinUri('BTC'))
            .reply(200, currencyBalancesCases.default.data);
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.getBalanceOfCoinUri('AAA'))
            .reply(200, currencyBalancesCases.dataAndAnyOtherField.data);
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.getBalanceOfCoinUri('BBB'))
            .reply(200, currencyBalancesCases.zeroBalance.data);

        expect('BTC').to.eql(currencyBalancesCases.default.data.data.coinType);
        expect(await kuCoinService.getBalance('BTC', exchangeCredentialsCases[0]))
            .to.eql(currencyBalancesCases.default.expected);

        expect('AAA').to.eql(currencyBalancesCases.dataAndAnyOtherField.data.data.coinType);
        expect(await kuCoinService.getBalance('AAA', exchangeCredentialsCases[0]))
            .to.eql(currencyBalancesCases.dataAndAnyOtherField.expected);

        expect('BBB').to.eql(currencyBalancesCases.zeroBalance.data.data.coinType);
        expect(await kuCoinService.getBalance('BBB', exchangeCredentialsCases[0]))
            .to.eql(currencyBalancesCases.zeroBalance.expected);
    });

    it('should get a balance of coin despite the connection error', async () => {
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.getBalanceOfCoinUri('BTC'))
            .replyWithError('An connection error from the test');
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.getBalanceOfCoinUri('BTC'))
            .reply(200, currencyBalancesCases.default.data);

        expect('BTC').to.eql(currencyBalancesCases.default.data.data.coinType);
        expect(await kuCoinService.getBalance('BTC', exchangeCredentialsCases[0]))
            .to.eql(currencyBalancesCases.default.expected);
    });

    it('should create an order', async () => {
        const currentExchangeCredentials = exchangeCredentialsCases[0];
        const order1: Order = {
            pair: ['AAA', 'BBB'],
            orderType: OrderType.Buy,
            price: 0.5,
            amount: 10
        };
        const order2: Order = {
            pair: ['AAA', 'CCC'],
            orderType: OrderType.Sell,
            price: 0.845,
            amount: 345
        };

        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .post(KuCoinConstants.createOrderUri)
            .query({
                symbol: `AAA-BBB`,
                type: 'BUY',
                price: order1.price,
                amount: order1.amount
            })
            .reply(200, createOrderCases.default.data);

        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .post(KuCoinConstants.createOrderUri)
            .query({
                symbol: `AAA-CCC`,
                type: 'SELL',
                price: order2.price,
                amount: order2.amount
            })
            .reply(200, createOrderCases.dataAndAnyOtherField.data);

        const createdOrder1 = await kuCoinService.createOrder(order1, currentExchangeCredentials);
        expect(createdOrder1).to.eql(createOrderCases.default.expected);

        const createdOrder2 = await kuCoinService.createOrder(order2, currentExchangeCredentials);
        expect(createdOrder2).to.eql(createOrderCases.dataAndAnyOtherField.expected);
    });

    it('should create an order despite the connection error', async () => {
        const order: Order = {
            pair: ['AAA', 'BBB'],
            orderType: OrderType.Buy,
            price: 0.5,
            amount: 10
        };

        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .post(KuCoinConstants.createOrderUri)
            .query({
                symbol: `AAA-BBB`,
                type: 'BUY',
                price: order.price,
                amount: order.amount
            })
            .replyWithError('An connection error from the test');
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .post(KuCoinConstants.createOrderUri)
            .query({
                symbol: `AAA-BBB`,
                type: 'BUY',
                price: order.price,
                amount: order.amount
            })
            .reply(200, createOrderCases.default.data);

        expect(await kuCoinService.createOrder(order, exchangeCredentialsCases[0]))
            .to.eql(createOrderCases.default.expected);
    });

    it('should delete an order correctly', async () => {
        const order1 = createOrderCases.default.expected;
        const order2 = createOrderCases.dataAndAnyOtherField.expected;

        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .post(KuCoinConstants.deleteOrderUri)
            .query({
                orderOid: order1.id,
                symbol: 'AAA-BBB',
                type: 'BUY'
            })
            .reply(200, deleteOrderCases.default.data);
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .post(KuCoinConstants.deleteOrderUri)
            .query({
                orderOid: order2.id,
                symbol: 'AAA-CCC',
                type: 'SELL'
            })
            .reply(200, deleteOrderCases.default.data);

        await kuCoinService.deleteOrder(order1, exchangeCredentialsCases[0]);
        await kuCoinService.deleteOrder(order2, exchangeCredentialsCases[0]);
    });

    it('should delete an order correctly despite the connection error', async () => {
        const order = createOrderCases.default.expected;

        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .post(KuCoinConstants.deleteOrderUri)
            .query({
                orderOid: order.id,
                symbol: 'AAA-BBB',
                type: 'BUY'
            })
            .replyWithError('An connection error from the test');
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .post(KuCoinConstants.deleteOrderUri)
            .query({
                orderOid: order.id,
                symbol: 'AAA-BBB',
                type: 'BUY'
            })
            .reply(200, deleteOrderCases.default.data);

        await kuCoinService.deleteOrder(order, exchangeCredentialsCases[0]);
    });

    it('should allow using a custom nonce generator', async () => {
        let currentNonce = 0;
        const currentExchangeCredentials = exchangeCredentialsCases[0];
        const currentApiEndpoint = KuCoinConstants.getBalanceOfCoinUri('BTC');
        const customNonceFactory = () => currentNonce += 2;
        const expectedSignature = kuCoinService.kuCoinSignatureMaker
            .sign(currentExchangeCredentials.secret, currentApiEndpoint, undefined, 2);
        nock(KuCoinConstants.serverProductionUrl, {
            reqheaders: getNockAuthHeaders({
                'KC-API-NONCE': 2,
                'KC-API-SIGNATURE': expectedSignature
            })
        })
            .get(currentApiEndpoint)
            .reply(200, currencyBalancesCases.default.data);

        kuCoinService.kuCoinNonceFactory = customNonceFactory;
        await kuCoinService.getBalance('BTC', currentExchangeCredentials);

        expect(currentNonce).to.eql(2);
    });
});
