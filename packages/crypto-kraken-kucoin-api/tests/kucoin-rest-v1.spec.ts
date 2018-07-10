import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { CurrencyPair } from 'crypto-kraken-core';
import * as nock from 'nock';
import { KuCoinConstants, KuCoinRestV1 } from 'src';
import {
    buyOrderBooksCases, commonCases,
    listExchangeRateOfCoinsCases, listLanguagesCases,
    listTradingMarketsCases, listTradingSymbolsTickCases, orderBooksCases,
    sellOrderBooksCases, tickCases, wrongBuyOrderBooksCases,
    wrongCommonCases, wrongListExchangeRateOfCoinsCases,
    wrongListLanguagesCases, wrongListTradingMarketsCases,
    wrongListTradingSymbolsTickCases, wrongOrderBooksCases,
    wrongSellOrderBooksCases, wrongTickCases
} from './data';

chai.use(chaiAsPromised);

describe('The KuCoin REST service of the V1 version', () => {
    let kuCoin: KuCoinRestV1;

    beforeEach(() => {
        kuCoin = new KuCoinRestV1();
        nock.cleanAll();
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

    it('should get list exchange rate of coins correctly', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listExchangeRateOfCoinsUri)
            .reply(200, listExchangeRateOfCoinsCases.default);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listExchangeRateOfCoinsUri)
            .query({
                coins: `BTC,ETH`
            })
            .reply(200, listExchangeRateOfCoinsCases.btcAndEth);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listExchangeRateOfCoinsUri)
            .query({
                coins: `AAA`
            })
            .reply(200, listExchangeRateOfCoinsCases.unknownCoin);

        const defaultRates = await kuCoin.listExchangeRateOfCoins();
        const btcAndEthRates = await kuCoin.listExchangeRateOfCoins({ coins: ['BTC', 'ETH'] });
        const unknownCoinRates = await kuCoin.listExchangeRateOfCoins({ coins: ['AAA'] });

        expect(defaultRates).to.eql(listExchangeRateOfCoinsCases.default);
        expect(btcAndEthRates).to.eql(listExchangeRateOfCoinsCases.btcAndEth);
        expect(unknownCoinRates).to.eql(listExchangeRateOfCoinsCases.unknownCoin);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get list exchange rate of coins operation', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listExchangeRateOfCoinsUri)
            .reply(200, wrongListExchangeRateOfCoinsCases.dataWithWrongCurrenciesFieldName);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listExchangeRateOfCoinsUri)
            .query({
                coins: `BTC,ETH`
            })
            .reply(200, wrongListExchangeRateOfCoinsCases.currencyWithMissingSymbol);

        const expectedExceptionMessage = /isn't the KuCoin list exchange rate of coins type/;
        await expect(kuCoin.listExchangeRateOfCoins()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listExchangeRateOfCoins({ coins: ['BTC', 'ETH'] }))
            .to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get a tick correctly', async () => {
        const currencyPair: CurrencyPair = { 0: 'KCS', 1: 'BTC' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.tickUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, tickCases.default);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.tickUri)
            .twice()
            .reply(200, tickCases.allCoins);

        const tick = await kuCoin.tick({ symbol: currencyPair });
        const allCoinsTick = await kuCoin.tick();
        const allCoinsTickWithEmptyParams = await kuCoin.tick({});

        expect(tick).to.eql(tickCases.default);
        expect(allCoinsTick)
            .to.eql(allCoinsTickWithEmptyParams)
            .to.eql(tickCases.allCoins);
    });

    it('should throw an exception when a response contained wrong data in the get tick operation', async () => {
        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.tickUri)
            .reply(200, wrongTickCases.allCoinsWithDataObj);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.tickUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongTickCases.withoutCoinType);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.tickUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongTickCases.withoutDateTime);

        const expectedExceptionMessage = /isn't the KuCoin tick type/;
        await expect(kuCoin.tick()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.tick({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.tick({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get a languages list correctly', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listLanguagesUri)
            .reply(200, listLanguagesCases.default);

        const listLanguages = await kuCoin.listLanguages();

        expect(listLanguages).to.eql(listLanguagesCases.default);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get languages list operation', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listLanguagesUri)
            .reply(200, wrongListLanguagesCases.withoutLanguageCode);

        const expectedExceptionMessage = /isn't the KuCoin language list type/;
        await expect(kuCoin.listLanguages()).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get an order book correctly', async () => {
        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, orderBooksCases.default);

        const orderBook = await kuCoin.orderBooks({ symbol: currencyPair });

        expect(orderBook).to.eql(orderBooksCases.default);
    });

    it('should throw an exception when a response contained wrong data in the get order book operation', async () => {
        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongOrderBooksCases.sellOrderWithMissingPrice);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongOrderBooksCases.buyOrderWithMissingAmount);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.orderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongOrderBooksCases.dataWithWrongOrderTypeName);

        const expectedExceptionMessage = /isn't the KuCoin order book type/;
        await expect(kuCoin.orderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.orderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.orderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get a buy order book correctly', async () => {
        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.buyOrderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, buyOrderBooksCases.default);

        const orderBook = await kuCoin.buyOrderBooks({ symbol: currencyPair });

        expect(orderBook).to.eql(buyOrderBooksCases.default);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get buy order book operation', async () => {
        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.buyOrderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongBuyOrderBooksCases.orderWithMissingPrice);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.buyOrderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongBuyOrderBooksCases.orderWithMissingAmount);

        const expectedExceptionMessage = /isn't the KuCoin buy order book type/;
        await expect(kuCoin.buyOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.buyOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get a sell order book correctly', async () => {
        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.sellOrderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, sellOrderBooksCases.default);

        const orderBook = await kuCoin.sellOrderBooks({ symbol: currencyPair });

        expect(orderBook).to.eql(sellOrderBooksCases.default);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get sell order book operation', async () => {
        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.sellOrderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongSellOrderBooksCases.orderWithMissingPrice);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.sellOrderBooksUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongSellOrderBooksCases.orderWithMissingAmount);

        const expectedExceptionMessage = /isn't the KuCoin sell order book type/;
        await expect(kuCoin.sellOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.sellOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get a list of trading markets correctly', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingMarketsUri)
            .reply(200, listTradingMarketsCases.default);

        const listTradingMarkets = await kuCoin.listTradingMarkets();

        expect(listTradingMarkets).to.eql(listTradingMarketsCases.default);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get a list of trading markets operation', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingMarketsUri)
            .reply(200, wrongListTradingMarketsCases.withWrongCoinName);

        const expectedExceptionMessage = /isn't the KuCoin list of trading markets/;
        await expect(kuCoin.listTradingMarkets()).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get a list of trading symbols tick correctly', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .query({
                market: 'BTC'
            })
            .reply(200, listTradingSymbolsTickCases.default);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .query({
                market: 'AAA'
            })
            .reply(200, listTradingSymbolsTickCases.withEmptyData);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .reply(200, listTradingSymbolsTickCases.default);

        const tickAllMarkets = await kuCoin.listTradingSymbolsTick();
        const tickBtcMarket = await kuCoin.listTradingSymbolsTick({ market: 'BTC' });
        const emptyMarket = await kuCoin.listTradingSymbolsTick({ market: 'AAA' });

        expect(tickAllMarkets).to.eql(listTradingSymbolsTickCases.default);
        expect(tickBtcMarket).to.eql(listTradingSymbolsTickCases.default);
        expect(emptyMarket).to.eql(listTradingSymbolsTickCases.withEmptyData);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get a list of trading symbols tick operation', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .query({
                market: 'BTC'
            })
            .reply(200, wrongListTradingSymbolsTickCases.withoutCoinType);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .query({
                market: 'AAA'
            })
            .reply(200, wrongListTradingSymbolsTickCases.withoutCoinType);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .reply(200, wrongListTradingSymbolsTickCases.withoutCoinType);

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .query({
                market: 'BTC'
            })
            .reply(200, wrongListTradingSymbolsTickCases.withoutSymbol);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .query({
                market: 'AAA'
            })
            .reply(200, wrongListTradingSymbolsTickCases.withoutSymbol);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTradingSymbolsTickUri)
            .reply(200, wrongListTradingSymbolsTickCases.withoutSymbol);

        const expectedExceptionMessage = /isn't the KuCoin list of trading symbols tick/;
        await expect(kuCoin.listTradingSymbolsTick()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick({ market: 'BTC' })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick({ market: 'AAA' })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick({ market: 'BTC' })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick({ market: 'AAA' })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should throw an exception when a response is wrong', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .persist()
            .get(() => true)
            .query(true)
            .reply(200, wrongCommonCases.wrongResponse);

        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };
        const expectedExceptionMessage = /isn't a KuCoin response result/;
        await expect(kuCoin.listExchangeRateOfCoins()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listExchangeRateOfCoins({ coins: ['BTC', 'ETH'] }))
            .to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listLanguages()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.tick()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.tick({ symbol: { 0: 'KCS', 1: 'BTC' } })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.orderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.buyOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.sellOrderBooks({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingMarkets()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick({ market: 'BTC' })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should return an error object when a response contained an error', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .persist()
            .get(() => true)
            .query(true)
            .reply(200, commonCases.commonError);
        const currencyPair: CurrencyPair = { 0: 'AAA', 1: 'BBB' };

        expect(await kuCoin.tick()).to.eql(commonCases.commonError);
        expect(await kuCoin.listExchangeRateOfCoins()).to.eql(commonCases.commonError);
        expect(await kuCoin.listExchangeRateOfCoins({ coins: ['BTC', 'ETH'] })).to.eql(commonCases.commonError);
        expect(await kuCoin.listLanguages()).to.eql(commonCases.commonError);
        expect(await kuCoin.tick({ symbol: { 0: 'KCS', 1: 'BTC' } })).to.eql(commonCases.commonError);
        expect(await kuCoin.orderBooks({ symbol: currencyPair })).to.eql(commonCases.commonError);
        expect(await kuCoin.buyOrderBooks({ symbol: currencyPair })).to.eql(commonCases.commonError);
        expect(await kuCoin.sellOrderBooks({ symbol: currencyPair })).to.eql(commonCases.commonError);
        expect(await kuCoin.listTradingMarkets()).to.eql(commonCases.commonError);
        expect(await kuCoin.listTradingSymbolsTick()).to.eql(commonCases.commonError);
        expect(await kuCoin.listTradingSymbolsTick({ market: 'BTC' })).to.eql(commonCases.commonError);
    });
});
