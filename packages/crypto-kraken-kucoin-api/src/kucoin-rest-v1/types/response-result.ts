import { FieldGuardsMap, isBoolean, isNumber, isString } from 'crypto-kraken-core';

export interface KuCoinResponseResult {
    success: boolean;
    code: string;
    timestamp: number;
}

export const kuCoinResponseResultGuardsMap: FieldGuardsMap<KuCoinResponseResult> = {
    success: isBoolean,
    code: isString,
    timestamp: isNumber
};
