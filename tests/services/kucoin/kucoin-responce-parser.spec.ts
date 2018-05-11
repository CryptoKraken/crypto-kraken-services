import { expect } from 'chai';
import { KuCoinResponseParser } from '../../../src/services/kucoin/kucoin-responce-parser';
import { CurrencyPair, Order, OrderType } from '../../../src/core';
import recentDealOrdersData, { wrongData as wrongRecentDealOrdersData } from './data/recent-deal-orders.data';

describe('KuCoin Responce Parser', () => {
    let kuCoinResponseParser: KuCoinResponseParser;

    beforeEach(() => {
        kuCoinResponseParser = new KuCoinResponseParser();
    });

    it('It should correct parse orders', () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];        
        const expectedOrders: Order[] = [
            {
                pair: currencyPair,
                orderType: OrderType.Buy,
                price: 0.5,
                amount: 10
            },
            {
                pair: currencyPair,
                orderType: OrderType.Sell,
                price: 0.52,
                amount: 345
            },
            {
                pair: currencyPair,
                orderType: OrderType.Buy,
                price: 0.1,
                amount: 185
            }
        ];
        
        const orders = kuCoinResponseParser.parseOrders(currencyPair, JSON.stringify(recentDealOrdersData[1]));
        expect(orders).to.eql(expectedOrders);
        expect(() => kuCoinResponseParser.parseOrders(currencyPair, JSON.stringify(wrongRecentDealOrdersData[0]))).to.throw(/isn't the order type/);
        expect(() => kuCoinResponseParser.parseOrders(currencyPair, JSON.stringify(wrongRecentDealOrdersData[1]))).to.throw(/SELL/);
        expect(() => kuCoinResponseParser.parseOrders(currencyPair, JSON.stringify(wrongRecentDealOrdersData[2]))).to.throw(/result/);
    });
});