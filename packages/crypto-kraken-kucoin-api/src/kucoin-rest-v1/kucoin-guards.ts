import { FieldGuardsMap, isArray, isBoolean, isNumber, isString } from 'crypto-kraken-core';
import {
    KuCoinAllCoinsTick, KuCoinBuyOrderBook, KuCoinErrorResponseResult,
    KuCoinOrderBook, KuCoinOrderType, KuCoinResponseResult,
    KuCoinSellOrderBook, KuCoinSuccessResponseResult, KuCoinTick
} from './kucoin-types';

export const kuCoinResponseResultGuardsMap: FieldGuardsMap<KuCoinResponseResult> = {
    success: isBoolean,
    code: isString
};

export const kuCoinErrorResponseResultGuardsMap: FieldGuardsMap<KuCoinErrorResponseResult> = {
    success: (value): value is KuCoinErrorResponseResult['success'] => value === false,
    code: isString,
    msg: isString
};

export const kuCoinSuccessResponseResultGuardsMap: FieldGuardsMap<KuCoinSuccessResponseResult> = {
    success: (value): value is KuCoinSuccessResponseResult['success'] => value === true,
    code: (value): value is KuCoinSuccessResponseResult['code'] => value === 'OK',
    msg: isString
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
        _comment: isString,
        BUY: {
            this: isArray,
            every: orderBookOrderGuard
        },
        SELL: {
            this: isArray,
            every: orderBookOrderGuard
        },
        timestamp: isNumber
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
