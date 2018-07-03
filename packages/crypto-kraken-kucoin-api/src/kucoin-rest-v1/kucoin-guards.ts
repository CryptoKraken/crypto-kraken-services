import { FieldGuardsMap, isArray, isBoolean, isNumber, isString } from 'crypto-kraken-core';
import {
    KuCoinErrorResponseResult, KuCoinOrderBook, KuCoinOrderType,
    KuCoinResponseResult, KuCoinSuccessResponseResult
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

const orderBookOrderGuard = <T>(value: any): value is T => {
    return typeof value[0] === 'number' && typeof value[1] === 'number' && typeof value[2] === 'number';
};
export const kuCoinOrderBookGuardsMap: FieldGuardsMap<KuCoinOrderBook> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        _comment: isString,
        BUY: {
            this: isArray as (value: any) => value is KuCoinOrderBook['data']['BUY'],
            every: orderBookOrderGuard as (value: any) => value is KuCoinOrderBook['data']['BUY'][0]
        },
        SELL: {
            this: isArray as (value: any) => value is KuCoinOrderBook['data']['SELL'],
            every: orderBookOrderGuard as (value: any) => value is KuCoinOrderBook['data']['SELL'][0]
        },
        timestamp: isNumber
    }
};

export const isKuCoinOrderType = (data: any): data is KuCoinOrderType => {
    /* istanbul ignore next */
    return data === KuCoinOrderType.SELL || data === KuCoinOrderType.BUY;
};
