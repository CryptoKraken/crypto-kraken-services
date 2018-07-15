import { FieldGuardsMap, isArray } from 'crypto-kraken-core';
import { isKuCoinOrderType, KuCoinOrderType } from './order-type';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinRecentlyDealOrders extends KuCoinSuccessResponseResult {
    data: Array<[
        /* Timestamp */ number,
        /* Order Type */ KuCoinOrderType,
        /* Price */ number,
        /* Amount */ number,
        /* Volume */ number
    ]>;
}

export const kuCoinRecentlyDealOrdersGuardsMap: FieldGuardsMap<KuCoinRecentlyDealOrders> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        this: isArray,
        every: (value: any): value is KuCoinRecentlyDealOrders['data'][0] => {
            return typeof value[0] === 'number' && typeof value[2] === 'number' && typeof value[3] === 'number' &&
                typeof value[4] === 'number' && isKuCoinOrderType(value[1]);
        }
    }
};
