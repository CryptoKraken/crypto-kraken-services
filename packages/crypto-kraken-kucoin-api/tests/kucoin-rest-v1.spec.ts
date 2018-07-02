import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { CurrencyPair } from 'crypto-kraken-core';
import * as nock from 'nock';
import { KuCoinConstants, KuCoinRestV1 } from 'src';
import { commonCases, orderBookCases, wrongCommonCases, wrongOrderBookCases } from './data';

chai.use(chaiAsPromised);

describe('The KuCoin REST service of the V1 version', () => {
    let kuCoin: KuCoinRestV1;

    beforeEach(() => {
        kuCoin = new KuCoinRestV1();
    });

    it('should take a partial object of options and set default values for undefined options', () => {
        kuCoin = new KuCoinRestV1();
        expect(kuCoin.serverUri).to.eql(KuCoinConstants.serverProductionUrl);
        expect(kuCoin.nonceFactory).to.not.be.undefined;

        kuCoin = new KuCoinRestV1({ serverUri: 'customUrl' });
        expect(kuCoin.serverUri).to.eql('customUrl');
        expect(kuCoin.nonceFactory).to.not.be.undefined;

        const customNonceFactory = () => 100;
        kuCoin = new KuCoinRestV1({ nonceFactory: customNonceFactory });
        expect(kuCoin.serverUri).to.eql(KuCoinConstants.serverProductionUrl);
        expect(kuCoin.nonceFactory).to.eql(customNonceFactory);
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

    it('should throw an exception when a response contained wrong data', async () => {
        const currencyPair: CurrencyPair = ['AAA', 'BBB'];
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongOrderBookCases.sellOrderWithMissingPrice);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongOrderBookCases.buyOrderWithMissingAmount);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongOrderBookCases.dataWithWrongOrderTypeName);

        const expectedExceptionMessage = /isn't the KuCoin order book type/;
        expect(kuCoin.getOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        expect(kuCoin.getOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        expect(kuCoin.getOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should throw an exception when a response is wrong', async () => {
        const nockScope = nock(KuCoinConstants.serverProductionUrl)
            .persist()
            .get(() => true)
            .query(true)
            .reply(200, wrongCommonCases.wrongResponse);

        const expectedExceptionMessage = /isn't a KuCoin response result/;
        expect(kuCoin.getOrderBooks({ symbol: ['AAA', 'BBB'] })).to.be.rejectedWith(expectedExceptionMessage);
        nockScope.persist(false);
    });

    it('should return an error object when a response contained an error', async () => {
        const nockScope = nock(KuCoinConstants.serverProductionUrl)
            .persist()
            .get(() => true)
            .query(true)
            .reply(200, commonCases.commonError);

        expect(await kuCoin.getOrderBooks({ symbol: ['AAA', 'BBB'] })).to.eql(commonCases.commonError);
        nockScope.persist(false);
    });
});
