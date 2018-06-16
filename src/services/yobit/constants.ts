import { CurrencyPair } from '../../core';
import { YobitUtils } from './yobit-utils';

const constants = {
    rootServerUrl: 'https://yobit.net',
    getRootPublicApiUrl: (rootServerUrl: string) => `${rootServerUrl}/api/3`,
    getRootPrivateApiUrl: (rootServerUrl: string) => `${rootServerUrl}/tapi`,
    getOrderBookUri: (pair: CurrencyPair) => `/depth/${YobitUtils.getPairSymbol(pair)}`,
    getTradesUri: (pair: CurrencyPair) => `/trades/${YobitUtils.getPairSymbol(pair)}`,
    balanceMethod: 'getInfo'
};

export const YobitConstants: Readonly<typeof constants> = constants;
