import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { CurrencyPair } from 'crypto-kraken-core';
import * as nock from 'nock';
import { KuCoinConstants, KuCoinRestV1 } from '../src';
import {
    buyOrderBooksCases,
    coinInfoCases,
    commonCases,
    listCoinsCases,
    listExchangeRateOfCoinsCases,
    listLanguagesCases,
    listTradingMarketsCases,
    listTradingSymbolsTickCases,
    listTrendingsCases,
    orderBooksCases,
    recentlyDealOrdersCases,
    sellOrderBooksCases,
    tickCases,
    tradingViewKLineConfigCases,
    tradingViewKLineDataCases,
    tradingViewSymbolTickCases,
    wrongBuyOrderBooksCases,
    wrongCoinInfoCases,
    wrongCommonCases,
    wrongListCoinsCases,
    wrongListExchangeRateOfCoinsCases,
    wrongListLanguagesCases,
    wrongListTradingMarketsCases,
    wrongListTradingSymbolsTickCases,
    wrongListTrendingsCases,
    wrongOrderBooksCases,
    wrongRecentlyDealOrdersCases,
    wrongSellOrderBooksCases,
    wrongTickCases,
    wrongTradingViewKLineConfigCases,
    wrongTradingViewKLineDataCases,
    wrongTradingViewSymbolTickCases
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

    it('should get recently deal orders correctly', async () => {
        const defaultCurrencyPair: CurrencyPair = { 0: 'BTC', 1: 'USDT' };
        const ethBtcCurrencyPair: CurrencyPair = { 0: 'ETH', 1: 'BTC' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${defaultCurrencyPair[0]}-${defaultCurrencyPair[1]}`
            })
            .reply(200, recentlyDealOrdersCases.default);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${ethBtcCurrencyPair[0]}-${ethBtcCurrencyPair[1]}`
            })
            .reply(200, recentlyDealOrdersCases.ethAndBtc);

        const defaultRecentlyDealOrders = await kuCoin.recentlyDealOrders({ symbol: defaultCurrencyPair });
        const ethBtcDealOrders = await kuCoin.recentlyDealOrders({ symbol: ethBtcCurrencyPair });

        expect(defaultRecentlyDealOrders).to.eql(recentlyDealOrdersCases.default);
        expect(ethBtcDealOrders).to.eql(recentlyDealOrdersCases.ethAndBtc);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get recently deal orders operation', async () => {
        const currencyPair: CurrencyPair = { 0: 'ETH', 1: 'BTC' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongRecentlyDealOrdersCases.withWrongOrders);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongRecentlyDealOrdersCases.oneOrderWithoutOrderType);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.recentlyDealOrdersUri)
            .query({
                symbol: `${currencyPair[0]}-${currencyPair[1]}`
            })
            .reply(200, wrongRecentlyDealOrdersCases.oneOrderWithoutPrice);

        const expectedExceptionMessage = /isn't the KuCoin list of recently deal orders/;
        await expect(kuCoin.recentlyDealOrders({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.recentlyDealOrders({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.recentlyDealOrders({ symbol: currencyPair })).to.be.rejectedWith(expectedExceptionMessage);
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

    it('should get a list of trending', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTrendingsUri)
            .query({
                market: 'BTC'
            })
            .reply(200, listTrendingsCases.default);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTrendingsUri)
            .query({
                market: 'BTC'
            })
            .reply(200, listTrendingsCases.ethNeoAndBtc);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTrendingsUri)
            .query({
                market: 'AAA'
            })
            .reply(200, listTrendingsCases.withEmptyData);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTrendingsUri)
            .reply(200, listTrendingsCases.default);

        const allMarketsTrending = await kuCoin.listTrendings();
        const btcTrending1 = await kuCoin.listTrendings({ market: 'BTC' });
        const btcTrending2 = await kuCoin.listTrendings({ market: 'BTC' });
        const wrongMarketTrending = await kuCoin.listTrendings({ market: 'AAA' });

        expect(allMarketsTrending).to.eql(listTrendingsCases.default);
        expect(btcTrending1).to.eql(listTrendingsCases.default);
        expect(btcTrending2).to.eql(listTrendingsCases.ethNeoAndBtc);
        expect(wrongMarketTrending).to.eql(listTrendingsCases.withEmptyData);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get a list of trending operation', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTrendingsUri)
            .query({
                market: 'BTC'
            })
            .reply(200, wrongListTrendingsCases.withoutCoinPair);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTrendingsUri)
            .query({
                market: 'AAA'
            })
            .reply(200, wrongListTrendingsCases.withoutCoinPair);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listTrendingsUri)
            .reply(200, wrongListTrendingsCases.withoutCoinPair);

        const expectedExceptionMessage = /isn't the KuCoin list of trending/;
        await expect(kuCoin.listTrendings()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTrendings({ market: 'BTC' })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTrendings({ market: 'AAA' })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get kline config (TradingView)', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineConfigUri)
            .reply(200, tradingViewKLineConfigCases.default);

        const defaultConfig = await kuCoin.getTradingViewKLineConfig();

        expect(defaultConfig).to.eql(tradingViewKLineConfigCases.default);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get kline config (TradingView)', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineConfigUri)
            .reply(200, wrongTradingViewKLineConfigCases.withoutSupportedResolutions);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineConfigUri)
            .reply(200, wrongTradingViewKLineConfigCases.withWrongSupportedResolutions);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineConfigUri)
            .reply(200, wrongTradingViewKLineConfigCases.withWrongSupportedResolutionsFieldName);

        const expectedExceptionMessage = /isn't the KuCoin KLine config of the Trading View/;
        await expect(kuCoin.getTradingViewKLineConfig()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.getTradingViewKLineConfig()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.getTradingViewKLineConfig()).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get symbol tick (TradingView)', async () => {
        const kcsBtcCurrencyPair: CurrencyPair = { 0: 'KCS', 1: 'BTC' };
        const ethBtcCurrencyPair: CurrencyPair = { 0: 'ETH', 1: 'BTC' };
        const unknownCurrencyPair: CurrencyPair = { 0: 'BTC', 1: 'ETH' };

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewSymbolTickUri)
            .query({
                symbol: `${kcsBtcCurrencyPair[0]}-${kcsBtcCurrencyPair[1]}`,
            })
            .reply(200, tradingViewSymbolTickCases.default);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewSymbolTickUri)
            .query({
                symbol: `${ethBtcCurrencyPair[0]}-${ethBtcCurrencyPair[1]}`,
            })
            .reply(200, tradingViewSymbolTickCases.ethAndBtc);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewSymbolTickUri)
            .query({
                symbol: `${unknownCurrencyPair[0]}-${unknownCurrencyPair[1]}`,
            })
            .reply(200, tradingViewSymbolTickCases.unknownBtcAndEthSymbol);

        const kcsBtcTradingViewTick = await kuCoin.getTradingViewSymbolTick({ symbol: kcsBtcCurrencyPair });
        const ethBtcTradingViewTick = await kuCoin.getTradingViewSymbolTick({ symbol: ethBtcCurrencyPair });
        const unknownTradingViewTick = await kuCoin.getTradingViewSymbolTick({ symbol: unknownCurrencyPair });

        expect(kcsBtcTradingViewTick).to.eql(tradingViewSymbolTickCases.default);
        expect(ethBtcTradingViewTick).to.eql(tradingViewSymbolTickCases.ethAndBtc);
        expect(unknownTradingViewTick).to.eql(tradingViewSymbolTickCases.unknownBtcAndEthSymbol);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get symbol tick (TradingView)', async () => {
        const kcsBtcCurrencyPair: CurrencyPair = { 0: 'KCS', 1: 'BTC' };
        const ethBtcCurrencyPair: CurrencyPair = { 0: 'ETH', 1: 'BTC' };
        const unknownCurrencyPair: CurrencyPair = { 0: 'BTC', 1: 'ETH' };

        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewSymbolTickUri)
            .query({
                symbol: `${ethBtcCurrencyPair[0]}-${ethBtcCurrencyPair[1]}`,
            })
            .reply(200, wrongTradingViewSymbolTickCases.withoutName);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewSymbolTickUri)
            .query({
                symbol: `${kcsBtcCurrencyPair[0]}-${kcsBtcCurrencyPair[1]}`,
            })
            .reply(200, wrongTradingViewSymbolTickCases.withWrongPriceScale);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewSymbolTickUri)
            .query({
                symbol: `${unknownCurrencyPair[0]}-${unknownCurrencyPair[1]}`,
            })
            .reply(200, wrongTradingViewSymbolTickCases.withWrongTradingViewError);

        const expectedExceptionMessage = /isn't the KuCoin tick of the Trading View/;
        await expect(kuCoin.getTradingViewSymbolTick({
            symbol: ethBtcCurrencyPair
        })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.getTradingViewSymbolTick({
            symbol: kcsBtcCurrencyPair
        })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.getTradingViewSymbolTick({
            symbol: unknownCurrencyPair
        })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get kline data (TradingView)', async () => {
        const ethBtcCurrencyPair: CurrencyPair = { 0: 'ETH', 1: 'BTC' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineDataUri)
            .query({
                symbol: `${ethBtcCurrencyPair[0]}-${ethBtcCurrencyPair[1]}`,
                from: 1422018000,
                to: 1532029207,
                resolution: 'W'
            })
            .reply(200, tradingViewKLineDataCases.simple);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineDataUri)
            .query({
                symbol: `${ethBtcCurrencyPair[0]}-${ethBtcCurrencyPair[1]}`,
                from: 1422018000,
                to: 1532029207,
                resolution: 'D'
            })
            .reply(200, tradingViewKLineDataCases.withNullValues);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineDataUri)
            .query({
                symbol: `${ethBtcCurrencyPair[0]}-${ethBtcCurrencyPair[1]}`,
                from: 1532029207,
                to: 1532029207,
                resolution: '60'
            })
            .reply(200, tradingViewKLineDataCases.noData);

        const weekKLineData = await kuCoin.getTradingViewKLineData({
            symbol: ethBtcCurrencyPair,
            from: 1422018000,
            to: 1532029207,
            resolution: 'W'
        });
        const dayKLineData = await kuCoin.getTradingViewKLineData({
            symbol: ethBtcCurrencyPair,
            from: 1422018000,
            to: 1532029207,
            resolution: 'D'
        });
        const emptyKLineData = await kuCoin.getTradingViewKLineData({
            symbol: ethBtcCurrencyPair,
            from: 1532029207,
            to: 1532029207,
            resolution: '60'
        });

        expect(weekKLineData).to.eql(tradingViewKLineDataCases.simple);
        expect(dayKLineData).to.eql(tradingViewKLineDataCases.withNullValues);
        expect(emptyKLineData).to.eql(tradingViewKLineDataCases.noData);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get kline data (TradingView)', async () => {
        const ethBtcCurrencyPair: CurrencyPair = { 0: 'ETH', 1: 'BTC' };
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineDataUri)
            .query({
                symbol: `${ethBtcCurrencyPair[0]}-${ethBtcCurrencyPair[1]}`,
                from: 1422018000,
                to: 1532029207,
                resolution: 'W'
            })
            .reply(200, wrongTradingViewKLineDataCases.otherObject);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getTradingViewKLineDataUri)
            .query({
                symbol: `${ethBtcCurrencyPair[0]}-${ethBtcCurrencyPair[1]}`,
                from: 1422018000,
                to: 1532029207,
                resolution: 'D'
            })
            .reply(200, wrongTradingViewKLineDataCases.withWrongStatus);

        const expectedExceptionMessage = /isn't the KuCoin KLineData type of the Trading View/;
        await expect(kuCoin.getTradingViewKLineData({
            symbol: ethBtcCurrencyPair,
            from: 1422018000,
            to: 1532029207,
            resolution: 'W'
        })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.getTradingViewKLineData({
            symbol: ethBtcCurrencyPair,
            from: 1422018000,
            to: 1532029207,
            resolution: 'D'
        })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get a coin info', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getCoinInfoUri)
            .query({
                coin: 'BTC'
            })
            .reply(200, coinInfoCases.default);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getCoinInfoUri)
            .query({
                coin: 'ETH'
            })
            .reply(200, coinInfoCases.ethInfo);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getCoinInfoUri)
            .query({
                coin: 'KCS'
            })
            .reply(200, coinInfoCases.kcsInfo);

        const btcInfo = await kuCoin.getCoinInfo({ coin: 'BTC' });
        const ethInfo = await kuCoin.getCoinInfo({ coin: 'ETH' });
        const kcsInfo = await kuCoin.getCoinInfo({ coin: 'KCS' });

        expect(btcInfo).to.eql(coinInfoCases.default);
        expect(ethInfo).to.eql(coinInfoCases.ethInfo);
        expect(kcsInfo).to.eql(coinInfoCases.kcsInfo);
    });

    it('should throw an exception when a response contained wrong data in the get a coin info operation', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getCoinInfoUri)
            .query({
                coin: 'ETH'
            })
            .reply(200, wrongCoinInfoCases.withoutCoinType);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.getCoinInfoUri)
            .query({
                coin: 'KCS'
            })
            .reply(200, wrongCoinInfoCases.txUrlUndefined);

        const expectedExceptionMessage = /isn't the KuCoin coin info type/;
        await expect(kuCoin.getCoinInfo({ coin: 'ETH' })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.getCoinInfo({ coin: 'KCS' })).to.be.rejectedWith(expectedExceptionMessage);
    });

    it('should get a list of coin infos', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listCoinsUri)
            .reply(200, listCoinsCases.default);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listCoinsUri)
            .reply(200, listCoinsCases.btcAndEthAndKcs);

        const defaultCoinInfos = await kuCoin.listCoins();
        const btcAndEthAndKcsInfos = await kuCoin.listCoins();

        expect(defaultCoinInfos).to.eql(listCoinsCases.default);
        expect(btcAndEthAndKcsInfos).to.eql(listCoinsCases.btcAndEthAndKcs);
    });

    // tslint:disable-next-line:max-line-length
    it('should throw an exception when a response contained wrong data in the get a list of coin infos operation', async () => {
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listCoinsUri)
            .reply(200, wrongListCoinsCases.withoutCoinType);
        nock(KuCoinConstants.serverProductionUrl)
            .get(KuCoinConstants.listCoinsUri)
            .reply(200, wrongListCoinsCases.txUrlUndefined);

        const expectedExceptionMessage = /isn't the KuCoin list of coin infos/;
        await expect(kuCoin.listCoins()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listCoins()).to.be.rejectedWith(expectedExceptionMessage);
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
        await expect(kuCoin.recentlyDealOrders({ symbol: { 0: 'ETH', 1: 'BTC' } }))
            .to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingMarkets()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTradingSymbolsTick({ market: 'BTC' })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTrendings()).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listTrendings({ market: 'BTC' })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.getCoinInfo({ coin: 'BTC' })).to.be.rejectedWith(expectedExceptionMessage);
        await expect(kuCoin.listCoins()).to.be.rejectedWith(expectedExceptionMessage);
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
        expect(await kuCoin.recentlyDealOrders({ symbol: { 0: 'ETH', 1: 'BTC' } })).to.eql(commonCases.commonError);
        expect(await kuCoin.listTradingMarkets()).to.eql(commonCases.commonError);
        expect(await kuCoin.listTradingSymbolsTick()).to.eql(commonCases.commonError);
        expect(await kuCoin.listTradingSymbolsTick({ market: 'BTC' })).to.eql(commonCases.commonError);
        expect(await kuCoin.listTrendings()).to.eql(commonCases.commonError);
        expect(await kuCoin.listTrendings({ market: 'BTC' })).to.eql(commonCases.commonError);
        expect(await kuCoin.getTradingViewKLineConfig()).to.eql(commonCases.commonError);
        expect(await kuCoin.getTradingViewSymbolTick({
            symbol: { 0: 'ETH', 1: 'BTC' }
        })).to.eql(commonCases.commonError);
        expect(await kuCoin.getTradingViewKLineData({
            symbol: { 0: 'ETH', 1: 'BTC' },
            from: 1422018000,
            to: 1532029207,
            resolution: 'W'
        })).to.eql(commonCases.commonError);
        expect(await kuCoin.getCoinInfo({ coin: 'BTC' })).to.eql(commonCases.commonError);
        expect(await kuCoin.listCoins()).to.eql(commonCases.commonError);
    });
});
