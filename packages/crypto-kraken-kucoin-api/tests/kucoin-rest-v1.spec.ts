import { expect } from 'chai';
import { orderBookCases } from 'data';
import * as nock from 'nock';
import { KuCoinConstants, KuCoinRestV1 } from 'src';
import { CurrencyPair } from 'src/core';

describe('The KuCoin REST service of the V1 version', () => {
    let kuCoin: KuCoinRestV1;

    beforeEach(() => {
        kuCoin = new KuCoinRestV1();
    });

    it('should get an order book correctly', async () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, orderBookCases.default);

        const orderBook = await kuCoin.getOrderBooks({ symbol: currencyPair });

        expect(orderBook)
            .to.eql(orderBookCases.default);
    });
});
