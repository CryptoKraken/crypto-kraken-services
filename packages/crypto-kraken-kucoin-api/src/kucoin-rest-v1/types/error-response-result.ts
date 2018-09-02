import { FieldGuardsMap, is, isNumber, isString } from 'crypto-kraken-core';
import { KuCoinResponseResult } from './response-result';

export interface KuCoinErrorResponseResult extends KuCoinResponseResult {
    success: false;
    msg: string;
}

export const kuCoinErrorResponseResultGuardsMap: FieldGuardsMap<KuCoinErrorResponseResult> = {
    success: (value): value is KuCoinErrorResponseResult['success'] => value === false,
    code: isString,
    msg: isString,
    timestamp: isNumber
};

export const isKuCoinErrorResponseResult = (data: any): data is KuCoinErrorResponseResult => {
    return is<KuCoinErrorResponseResult>(data, kuCoinErrorResponseResultGuardsMap);
};
