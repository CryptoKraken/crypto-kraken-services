import { FieldGuardsMap, isArray } from 'crypto-kraken-core';
import { OrderBookOrder, orderBookOrderGuard } from './common';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinSellOrderBooks extends KuCoinSuccessResponseResult {
    data: OrderBookOrder[];
}

export const kuCoinSellOrderBooksGuardsMap: FieldGuardsMap<KuCoinSellOrderBooks> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: orderBookOrderGuard
    }
};
