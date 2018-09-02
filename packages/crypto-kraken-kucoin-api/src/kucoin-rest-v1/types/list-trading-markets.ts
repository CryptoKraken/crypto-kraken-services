import { FieldGuardsMap, isArray, isString } from 'crypto-kraken-core';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinListTradingMarkets extends KuCoinSuccessResponseResult {
    data: string[];
}

export const kuCoinListTradingMarketsGuardsMap: FieldGuardsMap<KuCoinListTradingMarkets> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: isString
    }
};
