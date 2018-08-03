import { FieldGuardsMap, isNumber, isString } from 'crypto-kraken-core';
import { KuCoinResponseResult } from './response-result';

export interface KuCoinErrorResponseResult extends KuCoinResponseResult {
    success: false;
    code: string;
    msg: string;
}

export const kuCoinErrorResponseResultGuardsMap: FieldGuardsMap<KuCoinErrorResponseResult> = {
    success: (value): value is KuCoinErrorResponseResult['success'] => value === false,
    code: isString,
    msg: isString,
    timestamp: isNumber
};
