import * as request from 'request-promise-native';
import { CurrencyPair, DeepPartial, GuardFieldsSelector, GuardResult } from '../core';
import { KuCoinConstants } from './kucoin-constants';
import { KuCoinOrderBook, KuCoinOrderType } from './kucoin-types';
import { KuCoinUtils } from './kucoin-utils';

export interface KuCoinRestV1Options {
    serverUri: string;
    nonceFactory: () => Promise<number> | number;
}

const defaultKuCoinRestV1Options: KuCoinRestV1Options = {
    serverUri: KuCoinConstants.serverProductionUrl,
    nonceFactory: () => { throw new Error('Not implemented.'); }
};

export class KuCoinRestV1 {
    readonly serverUri: string;
    readonly nonceFactory: () => Promise<number> | number;

    constructor(options?: Partial<KuCoinRestV1Options>) {
        const {
            serverUri, nonceFactory
        } = options ? { ...defaultKuCoinRestV1Options, ...options } : { ...defaultKuCoinRestV1Options };

        this.serverUri = serverUri;
        this.nonceFactory = nonceFactory;
    }

    async getOrderBooks(parameters: {
        symbol: CurrencyPair,
        group?: number,
        limit?: number,
        direction?: KuCoinOrderType
    }): Promise<KuCoinOrderBook>;
    async getOrderBooks<T extends GuardFieldsSelector<KuCoinOrderBook>>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number,
            direction?: KuCoinOrderType
        },
        checkFields?: T
    ): Promise<GuardResult<KuCoinOrderBook, T>>;
    async getOrderBooks<T>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number,
            direction?: KuCoinOrderType
        },
        checkFields?: T
    ): Promise<KuCoinOrderBook| GuardResult<KuCoinOrderBook, T>> {
        await request.get(KuCoinConstants.orderBooksUri, {
            baseUrl: this.serverUri,
            qs: {
                symbol: KuCoinUtils.getSymbol(parameters.symbol),
                group: parameters.group,
                limit: parameters.limit,
                direction: parameters.direction
            }
        });
        if (checkFields)
            throw new Error('Not implemented.');
        throw new Error('Not implemented.');
    }
}
