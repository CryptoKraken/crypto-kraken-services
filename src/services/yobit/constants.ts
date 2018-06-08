import { CurrencyPair } from '../../core';
import { YobitUtils } from './yobit-utils';

const rootServerUrl = 'https://yobit.net';

const constants = {
    rootPublicApiUrl: `${rootServerUrl}/api/3`,
    rootPrivateApiUrl: `${rootServerUrl}/tapi`,
    getOrderBookUri: (pair: CurrencyPair) => `/depth/${YobitUtils.getPairSymbol(pair)}`,
    getTradesUri: (pair: CurrencyPair) => `/trades/${YobitUtils.getPairSymbol(pair)}`,
    balanceMethod: 'getInfo'
};

export const YobitConstants: Readonly<typeof constants> = constants;
