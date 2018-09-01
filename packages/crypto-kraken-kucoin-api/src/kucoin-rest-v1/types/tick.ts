import { FieldGuardsMap, isArray, isBoolean, isNumber, isString } from 'crypto-kraken-core';
import { isUndefinedOrNullOrNumber } from 'crypto-kraken-core/src/guards';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface CoinTick {
    coinType: string;
    trading: boolean;
    symbol: string;
    lastDealPrice?: number | null;
    buy?: number | null;
    sell?: number | null;
    change?: number | null;
    coinTypePair: string;
    sort: number;
    feeRate: number;
    volValue: number;
    high?: number | null;
    datetime: number;
    vol: number;
    low?: number | null;
    changeRate?: number | null;
}
export interface KuCoinTick extends KuCoinSuccessResponseResult {
    data: CoinTick;
}

export interface KuCoinAllCoinsTick extends KuCoinSuccessResponseResult {
    data: CoinTick[];
}

export const coinTickGuardsMap = {
    coinType: isString,
    trading: isBoolean,
    symbol: isString,
    lastDealPrice: isUndefinedOrNullOrNumber,
    buy: isUndefinedOrNullOrNumber,
    sell: isUndefinedOrNullOrNumber,
    change: isUndefinedOrNullOrNumber,
    coinTypePair: isString,
    sort: isNumber,
    feeRate: isNumber,
    volValue: isNumber,
    high: isUndefinedOrNullOrNumber,
    datetime: isNumber,
    vol: isNumber,
    low: isUndefinedOrNullOrNumber,
    changeRate: isUndefinedOrNullOrNumber
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
