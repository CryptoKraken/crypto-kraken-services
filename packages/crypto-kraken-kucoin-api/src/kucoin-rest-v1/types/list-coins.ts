import { FieldGuardsMap, isArray } from 'crypto-kraken-core';
import { CoinInfo, coinInfoGuardsMap } from './common';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinListCoins extends KuCoinSuccessResponseResult {
    data: CoinInfo[];
}

export const kuCoinListCoinsGuardsMap: FieldGuardsMap<KuCoinListCoins> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: coinInfoGuardsMap
    }
};
