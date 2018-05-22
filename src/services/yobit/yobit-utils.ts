import { CurrencyPair } from '../../core';

export const YobitUtils = {
    getPairSymbol: (pair: CurrencyPair) => `${pair[0]}_${pair[1]}`
};
