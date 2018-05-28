import { CurrencyPair } from '../../core';
import { YobitUtils } from './yobit-utils';

const constants = {
    rootServerUrl: 'https://yobit.net/api/3',
    getTradesUri: (pair: CurrencyPair) => `/trades/${YobitUtils.getPairSymbol(pair)}`
};

export const YobitConstants: Readonly<typeof constants> = constants;
