import { FieldGuardsMap, isArray, isBoolean, isNumber, isString } from 'crypto-kraken-core';
import { isNullOrNumber } from 'src/kucoin-rest-v1/types/common';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface CoinTick {
    coinType: string;
    trading: boolean;
    symbol: string;
    lastDealPrice: number | null;
    buy: number | null;
    sell: number | null;
    change: number;
    coinTypePair: string;
    sort: number;
    feeRate: number;
    volValue: number;
    high: number | null;
    datetime: number;
    vol: number;
    low: number | null;
    changeRate: number | null;
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
    lastDealPrice: isNullOrNumber,
    buy: isNullOrNumber,
    sell: isNullOrNumber,
    change: isNumber,
    coinTypePair: isString,
    sort: isNumber,
    feeRate: isNumber,
    volValue: isNumber,
    high: isNullOrNumber,
    datetime: isNumber,
    vol: isNumber,
    low: isNullOrNumber,
    changeRate: isNullOrNumber
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
