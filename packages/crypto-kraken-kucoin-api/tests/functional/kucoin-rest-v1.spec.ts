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
});
