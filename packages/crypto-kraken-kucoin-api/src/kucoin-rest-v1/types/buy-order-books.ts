import { FieldGuardsMap, isArray } from 'crypto-kraken-core';
import { OrderBookOrder, orderBookOrderGuard } from './common';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinBuyOrderBooks extends KuCoinSuccessResponseResult {
    data: OrderBookOrder[];
}

export const kuCoinBuyOrderBooksGuardsMap: FieldGuardsMap<KuCoinBuyOrderBooks> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: orderBookOrderGuard
    }
};
