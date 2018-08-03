import { FieldGuardsMap, isNumber, isString } from 'crypto-kraken-core';
import { KuCoinResponseResult } from './response-result';

export interface KuCoinSuccessResponseResult extends KuCoinResponseResult {
    success: true;
    code: 'OK';
    msg: string;
}

export const kuCoinSuccessResponseResultGuardsMap: FieldGuardsMap<KuCoinSuccessResponseResult> = {
    success: (value): value is KuCoinSuccessResponseResult['success'] => value === true,
    code: (value): value is KuCoinSuccessResponseResult['code'] => value === 'OK',
    msg: isString,
    timestamp: isNumber
};
