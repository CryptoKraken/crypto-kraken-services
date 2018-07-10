import { expect } from 'chai';
import * as nock from 'nock';
import { CurrencyPair, Order, OrderType } from '../../../src/core';
import { KuCoinRestV1 } from '../../../src/services/kucoin';
import { KuCoinConstants } from '../../../src/services/kucoin/kucoin-rest-v1/constants';
import { KuCoinAuthRequestHeaders } from '../../../src/services/kucoin/kucoin-rest-v1/kucoin-exchange-credentials';
import {
    activeOrderCases, createOrderCases,
    currencyBalancesCases, deleteOrderCases,
    exchangeCredentialsCases, orderBookCases, orderInfoCases, tradesCases
} from './data';

describe('KuCoin Exchange Service', () => {
    let kuCoinService: KuCoinRestV1;

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
        kuCoinService = new KuCoinRestV1();
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

    it('should get active orders correctly', async () => {
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.activeOrdersUri)
            .query({
                symbol: 'AAA-BBB'
            })
            .reply(200, activeOrderCases.default.data);
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.activeOrdersUri)
            .query({
                symbol: 'AAA-CCC'
            })
            .reply(200, activeOrderCases.buyAndSellOrders.data);

        expect(
            await kuCoinService.getActiveOrders(['AAA', 'BBB'], exchangeCredentialsCases[0])
        ).to.eql(activeOrderCases.default.expected);
        expect(
            await kuCoinService.getActiveOrders(['AAA', 'CCC'], exchangeCredentialsCases[0])
        ).to.eql(activeOrderCases.buyAndSellOrders.expected);
    });

    it('should get an order info correctly', async () => {
        const order1 = {
            id: '59e41cd69bd8d374c9956c75',
            orderType: OrderType.Sell,
            pair: { 0: 'KCS', 1: 'BTC' },
            price: 0.0001067,
            amount: 896.34
        };
        const order2 = {
            id: '5b26813af576fd2018168949',
            orderType: OrderType.Sell,
            pair: { 0: 'AAA', 1: 'BBB' },
            price: 1,
            amount: 10
        };

        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.orderInfoUri)
            .query({
                symbol: 'KCS-BTC',
                type: 'SELL',
                orderOid: '59e41cd69bd8d374c9956c75'
            })
            .reply(200, orderInfoCases.default.data);
        nock(KuCoinConstants.serverProductionUrl, { reqheaders: getNockAuthHeaders() })
            .get(KuCoinConstants.orderInfoUri)
            .query({
                symbol: 'AAA-BBB',
                type: 'SELL',
                orderOid: '5b26813af576fd2018168949'
            })
            .reply(200, orderInfoCases.withZeroRemainingAmount.data);

        const orderInfo1 = await kuCoinService.getOrderInfo(order1, exchangeCredentialsCases[0]);
        const orderInfo2 = await kuCoinService.getOrderInfo(order2, exchangeCredentialsCases[0]);

        expect(orderInfo1).to.eql(orderInfoCases.default.expected);
        expect(orderInfo2).to.eql(orderInfoCases.withZeroRemainingAmount.expected);
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
