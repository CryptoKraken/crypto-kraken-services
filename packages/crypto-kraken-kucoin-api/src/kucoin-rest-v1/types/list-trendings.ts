import { FieldGuardsMap, isArray, isString } from 'crypto-kraken-core';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinListTrendings extends KuCoinSuccessResponseResult {
    data: Array<{
        coinPair: string,
        deals: Array<[
            number,
            number | null
        ]>
    }>;
}

export const kuCoinListTrendingsGuardsMap: FieldGuardsMap<KuCoinListTrendings> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: {
            coinPair: isString,
            deals: {
                this: isArray,
                every: (value: any): value is KuCoinListTrendings['data'][0]['deals'][0] => {
                    return typeof value[0] === 'number' && (value[1] === null || typeof value[1] === 'number');
                }
            }
        }
    }
};
