import { FieldGuardsMap, isArray, isBoolean, isNumber, isString } from 'crypto-kraken-core';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

interface CoinTick {
    coinType: string;
    trading: boolean;
    symbol: string;
    lastDealPrice: number;
    buy: number;
    sell: number;
    change: number;
    coinTypePair: string;
    sort: number;
    feeRate: number;
    volValue: number;
    high: number;
    datetime: number;
    vol: number;
    low: number;
    changeRate: number;
}
export interface KuCoinTick extends KuCoinSuccessResponseResult {
    data: CoinTick;
}

export interface KuCoinAllCoinsTick extends KuCoinSuccessResponseResult {
    data: CoinTick[];
}

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
