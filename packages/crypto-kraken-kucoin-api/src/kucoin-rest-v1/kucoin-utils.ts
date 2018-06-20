import { CurrencyPair } from '../core';

export const KuCoinUtils = {
    getSymbol: (currencyPair: CurrencyPair) => `${currencyPair[0]}-${currencyPair[1]}`
};
