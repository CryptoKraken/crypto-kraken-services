import { expect } from 'chai';
import {
    isKuCoinErrorResponseResult,
    KuCoinErrorResponseResult,
    KuCoinListExchangeRateOfCoins,
    KuCoinRestV1
} from '../../src';

const getFailTestMessageOnErrorResponseResult = (operationName: keyof KuCoinRestV1, error: KuCoinErrorResponseResult) =>
    `The ${operationName} operation returns the following error: ${error.msg}`;

describe('The KuCoin REST service of the V1 version', () => {
    let kuCoin: KuCoinRestV1;

    beforeEach(() => {
        kuCoin = new KuCoinRestV1();
    });

    it('should get list exchange rate of coins correctly', async () => {
        const defaultCoinRates = await kuCoin.listExchangeRateOfCoins();
        const btcAndEthRates = await kuCoin.listExchangeRateOfCoins({ coins: ['BTC', 'ETH'] });
        const unknownCoinRates = await kuCoin.listExchangeRateOfCoins({ coins: ['AAA'] });
        const unknownCoinAndEthRates = await kuCoin.listExchangeRateOfCoins({ coins: ['BBB', 'ETH'] });

        const operationName = 'listExchangeRateOfCoins';
        if (isKuCoinErrorResponseResult(defaultCoinRates))
            return expect.fail(getFailTestMessageOnErrorResponseResult(operationName, defaultCoinRates));
        if (isKuCoinErrorResponseResult(btcAndEthRates))
            return expect.fail(getFailTestMessageOnErrorResponseResult(operationName, btcAndEthRates));
        if (isKuCoinErrorResponseResult(unknownCoinRates))
            return expect.fail(getFailTestMessageOnErrorResponseResult(operationName, unknownCoinRates));
        if (isKuCoinErrorResponseResult(unknownCoinAndEthRates))
            return expect.fail(getFailTestMessageOnErrorResponseResult(operationName, unknownCoinAndEthRates));

        const checkCorrespondingCurrenciesAndRates = (coins: string[], kuCoinResult: KuCoinListExchangeRateOfCoins) => {
            /**
             * data: {
             *  rates: {
             *      BTC: {
             *          USD: 200000
             *      }
             *  },
             *  currencies: [
             *      ['USD', '$']
             *  ]
             * }
             */
            const coinNames = Object.getOwnPropertyNames(kuCoinResult.data.rates);
            const currencyNames = kuCoinResult.data.currencies.map(currency => currency[0]);
            expect(coins).to.have.members(coinNames);

            coinNames.forEach(coinName => {
                const currencyNamesByCoin = Object.getOwnPropertyNames(kuCoinResult.data.rates[coinName]);
                expect(currencyNames).to.have.members(currencyNamesByCoin);
            });
        };

        const defaultCoinRatesFieldNames = Object.getOwnPropertyNames(defaultCoinRates.data.rates);
        expect(defaultCoinRatesFieldNames.length).to.eql(1);
        const defaultCoinName = defaultCoinRatesFieldNames[0];

        checkCorrespondingCurrenciesAndRates([defaultCoinName], defaultCoinRates);
        checkCorrespondingCurrenciesAndRates(['BTC', 'ETH'], btcAndEthRates);

        // Rates should be empty when we pass an unknown coin
        expect(unknownCoinRates.data.rates).to.be.empty;
        checkCorrespondingCurrenciesAndRates(['ETH'], unknownCoinAndEthRates);
    });

    it('should get a list of languages correctly', async () => {
        const listLanguages = await kuCoin.listLanguages();

        if (isKuCoinErrorResponseResult(listLanguages))
            return expect.fail(getFailTestMessageOnErrorResponseResult('listLanguages', listLanguages));

        expect(listLanguages.data).to.not.be.empty;
        expect(listLanguages.data).to.include.deep.members([['en_US', 'English', true]]);
    });

    it('should get a tick correctly', async () => {
        const symbol = undefined;
        const ethBtcTick = await kuCoin.tick({ symbol: { 0: 'ETH', 1: 'BTC' } });
        const btcEth = await kuCoin.tick({ symbol: { 0: 'BTC', 1: 'ETH' } });
        const allCoinsTick1 = await kuCoin.tick();
        const allCoinsTick2 = await kuCoin.tick({ symbol });

        if (isKuCoinErrorResponseResult(ethBtcTick))
            return expect.fail(getFailTestMessageOnErrorResponseResult('tick', ethBtcTick));
        if (!isKuCoinErrorResponseResult(btcEth))
            return expect.fail(`the type of the 'btcEth' should be the KuCoinErrorResponseResult`);
        if (isKuCoinErrorResponseResult(allCoinsTick1))
            return expect.fail(getFailTestMessageOnErrorResponseResult('tick', allCoinsTick1));
        if (isKuCoinErrorResponseResult(allCoinsTick2))
            return expect.fail(getFailTestMessageOnErrorResponseResult('tick', allCoinsTick2));
        if (isKuCoinErrorResponseResult(allCoinsTick2))
            return expect.fail(getFailTestMessageOnErrorResponseResult('tick', allCoinsTick2));
        if (!Array.isArray(allCoinsTick2.data))
            return expect.fail(`the type of the 'allCoinsTick2.data' should be the Array<CoinTick>`);

        expect(ethBtcTick.data.coinTypePair).to.eql('BTC');
        expect(ethBtcTick.data.coinType).to.eql('ETH');
        expect(ethBtcTick.data.symbol).to.eql('ETH-BTC');
        expect(allCoinsTick1.data).to.have.lengthOf(allCoinsTick2.data.length);

        const ethBtcTickFromAll1 = allCoinsTick1.data.find(coinTick => coinTick.symbol === 'ETH-BTC');
        const ethBtcTickFromAll2 = allCoinsTick2.data.find(coinTick => coinTick.symbol === 'ETH-BTC');
        expect(ethBtcTickFromAll1).to.not.be.undefined;
        expect(ethBtcTickFromAll2).to.not.be.undefined;
        expect(ethBtcTickFromAll2!.symbol)
            .to.be.eql(ethBtcTickFromAll1!.symbol)
            .to.be.eql(ethBtcTick.data.symbol);
    });
});
