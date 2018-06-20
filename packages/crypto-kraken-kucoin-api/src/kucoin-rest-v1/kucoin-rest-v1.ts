import { CurrencyPair } from '../core';
import { KuCoinOrderBook, KuCoinOrderType } from './kucoin-types';

export class KuCoinRestV1 {
    async getOrderBooks(
        symbol: CurrencyPair,
        group?: number,
        limit?: number,
        direction?: KuCoinOrderType
    ): Promise<KuCoinOrderBook> {
        throw new Error('Method not implemented.');
    }
}
