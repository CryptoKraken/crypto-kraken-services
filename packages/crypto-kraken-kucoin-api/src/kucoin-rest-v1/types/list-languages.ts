import { FieldGuardsMap, isArray } from 'crypto-kraken-core';
import { kuCoinCommentGuard } from './common';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinListLanguages extends KuCoinSuccessResponseResult {
    _comment: string | undefined;
    data: Array<[
        /* Language code */ string,
        /* Language symbol */ string,
        /* Is language available */ boolean
    ]>;
}

export const kuCoinListLanguagesGuardsMap: FieldGuardsMap<KuCoinListLanguages> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    _comment: kuCoinCommentGuard,
    data: {
        this: isArray,
        every: (value: any): value is KuCoinListLanguages['data'][0] => {
            return typeof value[0] === 'string' && typeof value[1] === 'string' && typeof value[2] === 'boolean';
        }
    }
};
