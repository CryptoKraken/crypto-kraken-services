import { expect } from 'chai';
import * as nock from 'nock';
import { KuCoinService, InternalConstants as KuCoinInternalConstants } from '../../../src/services/kucoin';
import { CurrencyPair, Order, OrderType } from '../../../src/core';
import recentDealOrdersData from './data/recent-deal-orders.data';

describe('KuCoin Exchange Service', () => {
    let kuCoinResponse: KuCoinService;

    beforeEach(() => {
        kuCoinResponse = new KuCoinService();
    });

    it('should get recent deal orders', async () => {
        const currentCase = recentDealOrdersData[0];
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];

        nock(KuCoinInternalConstants.KUCOIN_DEFAULT_SERVER_PRODUCTION_URI)
            .get(KuCoinInternalConstants.KUCOIN_DEFAULT_RECENTLY_DEAL_ORDERS_URI)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .twice()
            .reply(200, currentCase);

        const orders = await kuCoinResponse.getRecentDealOrders(currencyPair);
        const orders1 = await kuCoinResponse.getRecentDealOrders(currencyPair);

        expect(orders).to.eql(orders1);
        expect(orders[0].amount).to.eql(currentCase.data[0][3]);
        expect(orders[0].orderType).to.eql(OrderType.Sell);
        expect(currentCase.data[0][1]).to.eql('SELL');
        expect(orders[0].pair).to.eql(currencyPair);
        expect(orders[0].price).to.eql(currentCase.data[0][2]);

        expect(orders1[1].amount).to.eql(currentCase.data[1][3]);
        expect(orders1[1].orderType).to.eql(OrderType.Sell);
        expect(currentCase.data[1][1]).to.eql('SELL');
        expect(orders1[1].pair).to.eql(currencyPair);
        expect(orders1[1].price).to.eql(currentCase.data[1][2]);
    });
});