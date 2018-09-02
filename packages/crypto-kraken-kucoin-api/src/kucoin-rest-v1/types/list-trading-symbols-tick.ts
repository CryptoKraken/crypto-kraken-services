import { FieldGuardsMap, isArray } from 'crypto-kraken-core';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';
import { CoinTick, coinTickGuardsMap } from './tick';

export interface KuCoinListTradingSymbolsTick extends KuCoinSuccessResponseResult {
    data: CoinTick[];
}

export const kuCoinListTradingSymbolsTickGuardsMap: FieldGuardsMap<KuCoinListTradingSymbolsTick> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: coinTickGuardsMap
    }
};
