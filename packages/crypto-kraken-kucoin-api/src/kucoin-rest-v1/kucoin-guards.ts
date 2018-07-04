import { FieldGuardsMap, isArray, isBoolean, isNumber, isString } from 'crypto-kraken-core';
import {
    KuCoinAllCoinsTick, KuCoinBuyOrderBook, KuCoinErrorResponseResult,
    KuCoinListExchangeRateOfCoins, KuCoinOrderBook, KuCoinOrderType,
    KuCoinResponseResult, KuCoinSellOrderBook, KuCoinSuccessResponseResult, KuCoinTick
} from './kucoin-types';

export const kuCoinResponseResultGuardsMap: FieldGuardsMap<KuCoinResponseResult> = {
    success: isBoolean,
    code: isString,
    timestamp: isNumber
};

export const kuCoinErrorResponseResultGuardsMap: FieldGuardsMap<KuCoinErrorResponseResult> = {
    success: (value): value is KuCoinErrorResponseResult['success'] => value === false,
    code: isString,
    msg: isString,
    timestamp: isNumber
};

export const kuCoinSuccessResponseResultGuardsMap: FieldGuardsMap<KuCoinSuccessResponseResult> = {
    success: (value): value is KuCoinSuccessResponseResult['success'] => value === true,
    code: (value): value is KuCoinSuccessResponseResult['code'] => value === 'OK',
    msg: isString,
    timestamp: isNumber
};

const kuCoinCommentGuard = (value: any): value is string | undefined => {
    return value === undefined || typeof value === 'string';
};

export const kuCoinListExchangeRateOfCoinsGuardsMap: FieldGuardsMap<KuCoinListExchangeRateOfCoins> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        currencies: {
            this: isArray as (value: any) => value is KuCoinListExchangeRateOfCoins['data']['currencies'],
            every: (value: any): value is KuCoinListExchangeRateOfCoins['data']['currencies'][0] => {
                return typeof value[0] === 'string' && typeof value[1] === 'string';
            }
        },
        rates: (value: any): value is KuCoinListExchangeRateOfCoins['data']['rates'] => {
            /*
                When we request a rate of an unknown/wrong coin, KuCoin gives us a data with the empty 'rates' field,
                whose type is array, that is, the 'rates' field is an empty array.
                So we check a value here for an empty array, and if so, then we return true.
            */
            if (Array.isArray(value) && !value.length)
                return true;
            return value && Object.getOwnPropertyNames(value).every(cryptoName => {
                return value[cryptoName] && Object.getOwnPropertyNames(value[cryptoName]).every(currencyName => {
                    return typeof value[cryptoName][currencyName] === 'number';
                });
            });
        }
    }
};

const coinTickGuardsMap = {
    coinType: isString,
    trading: isBoolean,
    symbol: isString,
    lastDealPrice: isNumber,
    buy: isNumber,
    sell: isNumber,
    change: isNumber,
    coinTypePair: isString,
    sort: isNumber,
    feeRate: isNumber,
    volValue: isNumber,
    high: isNumber,
    datetime: isNumber,
    vol: isNumber,
    low: isNumber,
    changeRate: isNumber
};
export const kuCoinTickGuardsMap: FieldGuardsMap<KuCoinTick> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: coinTickGuardsMap
};

export const kuCoinAllCoinsTickGuardsMap: FieldGuardsMap<KuCoinAllCoinsTick> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: coinTickGuardsMap
    }
};

const orderBookOrderGuard = (value: any): value is [number, number, number] => {
    return typeof value[0] === 'number' && typeof value[1] === 'number' && typeof value[2] === 'number';
};
export const kuCoinOrderBookGuardsMap: FieldGuardsMap<KuCoinOrderBook> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        _comment: kuCoinCommentGuard,
        BUY: {
            this: isArray,
            every: orderBookOrderGuard
        },
        SELL: {
            this: isArray,
            every: orderBookOrderGuard
        }
    }
};

export const kuCoinBuyOrderBookGuardsMap: FieldGuardsMap<KuCoinBuyOrderBook> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: orderBookOrderGuard
    }
};

export const kuCoinSellOrderBookGuardsMap: FieldGuardsMap<KuCoinSellOrderBook> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: orderBookOrderGuard
    }
};

export const isKuCoinOrderType = (data: any): data is KuCoinOrderType => {
    /* istanbul ignore next */
    return data === KuCoinOrderType.SELL || data === KuCoinOrderType.BUY;
};
