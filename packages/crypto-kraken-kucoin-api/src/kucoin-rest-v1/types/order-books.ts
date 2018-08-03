import { FieldGuardsMap, isArray } from 'crypto-kraken-core';
import { kuCoinCommentGuard, OrderBookOrder, orderBookOrderGuard } from './common';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinOrderBooks extends KuCoinSuccessResponseResult {
    data: {
        _comment: string | undefined;
        SELL: OrderBookOrder[];
        BUY: OrderBookOrder[];
    };
}

export const kuCoinOrderBooksGuardsMap: FieldGuardsMap<KuCoinOrderBooks> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        _comment: kuCoinCommentGuard,
        BUY: {
            this: isArray,
            every: orderBookOrderGuard
        },
        SELL: {
            this: isArray,
            every: orderBookOrderGuard
        }
    }
};
