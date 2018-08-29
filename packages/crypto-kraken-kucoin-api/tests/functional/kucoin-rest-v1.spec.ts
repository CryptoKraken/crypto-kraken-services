import { expect } from 'chai';
import {
    isKuCoinErrorResponseResult,
    KuCoinErrorResponseResult,
    KuCoinListExchangeRateOfCoins,
    KuCoinRestV1
} from '../../src';

const getFailTestMessageOnErrorResponseResult = (operationName: string, error: KuCoinErrorResponseResult) =>
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
        if (isKuCoinErrorResponseResult(defaultCoinRates)) {
            expect.fail(getFailTestMessageOnErrorResponseResult(operationName, defaultCoinRates));
            return;
        }
        if (isKuCoinErrorResponseResult(btcAndEthRates)) {
            expect.fail(getFailTestMessageOnErrorResponseResult(operationName, btcAndEthRates));
            return;
        }
        if (isKuCoinErrorResponseResult(unknownCoinRates)) {
            expect.fail(getFailTestMessageOnErrorResponseResult(operationName, unknownCoinRates));
            return;
        }
        if (isKuCoinErrorResponseResult(unknownCoinAndEthRates)) {
            expect.fail(getFailTestMessageOnErrorResponseResult(operationName, unknownCoinAndEthRates));
            return;
        }

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
});
