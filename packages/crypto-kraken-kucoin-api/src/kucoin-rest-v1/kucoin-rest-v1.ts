import { CurrencyPair, FieldsSelector, FieldsSelectorResult, is } from 'crypto-kraken-core';
import * as request from 'request-promise-native';
import { KuCoinConstants } from './kucoin-constants';
import {
    kuCoinErrorResponseResultGuardsMap,
    kuCoinOrderBookGuardsMap,
    kuCoinResponseResultGuardsMap
} from './kucoin-guards';
import {
    KuCoinErrorResponseResult,
    KuCoinOrderBook,
    KuCoinOrderType
} from './kucoin-types';
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
    }): Promise<KuCoinOrderBook | KuCoinErrorResponseResult>;
    async getOrderBooks<T extends FieldsSelector<KuCoinOrderBook>>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number,
            direction?: KuCoinOrderType
        },
        checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinOrderBook, T> | KuCoinErrorResponseResult>;
    async getOrderBooks<T>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number,
            direction?: KuCoinOrderType
        },
        checkFields?: T
    ): Promise<KuCoinOrderBook | FieldsSelectorResult<KuCoinOrderBook, T> | KuCoinErrorResponseResult> {
        const rawResponseResult = await request.get(KuCoinConstants.orderBooksUri, {
            baseUrl: this.serverUri,
            qs: {
                symbol: KuCoinUtils.getSymbol(parameters.symbol),
                group: parameters.group,
                limit: parameters.limit,
                direction: parameters.direction
            }
        });

        const responseResult = this.parseRawResponseResult(rawResponseResult, checkFields);
        if (is<KuCoinErrorResponseResult, T>(responseResult, kuCoinErrorResponseResultGuardsMap, checkFields))
            return responseResult;

        if (!(is<KuCoinOrderBook, T>(responseResult, kuCoinOrderBookGuardsMap, checkFields)))
            throw new Error(`The result ${responseResult} isn't the KuCoin order book type.`);
        return responseResult;
    }

    protected parseRawResponseResult<T>(rawResponseResult: string, checkFields: T) {
        const obj = JSON.parse(rawResponseResult);
        if (is(obj, kuCoinResponseResultGuardsMap, checkFields))
            return obj;
        throw new Error(`The result ${rawResponseResult} isn't a KuCoin response result.`);
    }
}
