import { FieldGuardsMap } from 'crypto-kraken-core';
import { CoinInfo, coinInfoGuardsMap } from './common';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinCoinInfo extends KuCoinSuccessResponseResult {
    data: CoinInfo;
}

export const kuCoinCoinInfoGuardsMap: FieldGuardsMap<KuCoinCoinInfo> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: coinInfoGuardsMap
};
