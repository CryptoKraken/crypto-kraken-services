import { OrderType } from '../../core';
import { KuCoinOrderType } from './kucoin-types';

export const KuCoinUtils = {
    getKuCoinOrderType: (orderType: OrderType) => {
        return orderType === OrderType.Sell ? KuCoinOrderType.SELL : KuCoinOrderType.BUY;
    },
    getOrderType: (kuCoinOrderType: KuCoinOrderType) => {
        return kuCoinOrderType === KuCoinOrderType.SELL ? OrderType.Sell : OrderType.Buy;
    }
};
