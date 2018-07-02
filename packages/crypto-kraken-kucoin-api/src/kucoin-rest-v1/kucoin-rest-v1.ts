import { CurrencyPair, FieldsSelector, FieldsSelectorResult, is } from 'crypto-kraken-core';
import * as request from 'request-promise-native';
import { KuCoinConstants } from './kucoin-constants';
import {
    kuCoinBuyOrderBookGuardsMap,
    kuCoinErrorResponseResultGuardsMap,
    kuCoinOrderBookGuardsMap,
    kuCoinResponseResultGuardsMap,
    kuCoinSellOrderBookGuardsMap,
    kuCoinTickGuardsMap
} from './kucoin-guards';
import {
    KuCoinBuyOrderBook,
    KuCoinErrorResponseResult,
    KuCoinOrderBook,
    KuCoinOrderType,
    KuCoinSellOrderBook,
    KuCoinTick
} from './kucoin-types';
import { KuCoinUtils } from './kucoin-utils';

export interface KuCoinRestV1Options {
    serverUri: string;
    nonceFactory: () => Promise<number> | number;
}

const defaultKuCoinRestV1Options: KuCoinRestV1Options = {
    serverUri: KuCoinConstants.serverProductionUrl,
    nonceFactory: () => {
        /* istanbul ignore next */
        throw new Error('Not implemented.');
    }
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

    async tick(parameters: { symbol: CurrencyPair }): Promise<KuCoinTick | KuCoinErrorResponseResult>;
    async tick<T extends FieldsSelector<KuCoinTick>>(
        parameters: { symbol: CurrencyPair }, checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinTick, T> | KuCoinErrorResponseResult>;
    async tick<T>(
        parameters: { symbol: CurrencyPair }, checkFields?: T
    ): Promise<KuCoinTick | FieldsSelectorResult<KuCoinTick, T> | KuCoinErrorResponseResult> {
        const rawResponseResult = await request.get(KuCoinConstants.tickUri, {
            baseUrl: this.serverUri,
            qs: {
                symbol: KuCoinUtils.getSymbol(parameters.symbol)
            }
        });

        const responseResult = this.parseRawResponseResult(rawResponseResult, checkFields);
        if (is<KuCoinErrorResponseResult, T>(responseResult, kuCoinErrorResponseResultGuardsMap, checkFields))
            return responseResult;

        if (!(is<KuCoinTick, T>(responseResult, kuCoinTickGuardsMap, checkFields)))
            throw new Error(`The result ${responseResult} isn't the KuCoin tick type.`);
        return responseResult;
    }

    async orderBooks(parameters: {
        symbol: CurrencyPair,
        group?: number,
        limit?: number,
        direction?: KuCoinOrderType
    }): Promise<KuCoinOrderBook | KuCoinErrorResponseResult>;
    async orderBooks<T extends FieldsSelector<KuCoinOrderBook>>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number,
            direction?: KuCoinOrderType
        },
        checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinOrderBook, T> | KuCoinErrorResponseResult>;
    async orderBooks<T>(
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

    async buyOrderBooks(parameters: {
        symbol: CurrencyPair,
        group?: number,
        limit?: number
    }): Promise<KuCoinBuyOrderBook | KuCoinErrorResponseResult>;
    async buyOrderBooks<T extends FieldsSelector<KuCoinBuyOrderBook>>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number
        },
        checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinBuyOrderBook, T> | KuCoinErrorResponseResult>;
    async buyOrderBooks<T>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number
        },
        checkFields?: T
    ): Promise<KuCoinBuyOrderBook | FieldsSelectorResult<KuCoinBuyOrderBook, T> | KuCoinErrorResponseResult> {
        const rawResponseResult = await request.get(KuCoinConstants.buyOrderBooksUri, {
            baseUrl: this.serverUri,
            qs: {
                symbol: KuCoinUtils.getSymbol(parameters.symbol),
                group: parameters.group,
                limit: parameters.limit
            }
        });

        const responseResult = this.parseRawResponseResult(rawResponseResult, checkFields);
        if (is<KuCoinErrorResponseResult, T>(responseResult, kuCoinErrorResponseResultGuardsMap, checkFields))
            return responseResult;

        if (!(is<KuCoinBuyOrderBook, T>(responseResult, kuCoinBuyOrderBookGuardsMap, checkFields)))
            throw new Error(`The result ${responseResult} isn't the KuCoin buy order book type.`);
        return responseResult;
    }

    async sellOrderBooks(parameters: {
        symbol: CurrencyPair,
        group?: number,
        limit?: number
    }): Promise<KuCoinSellOrderBook | KuCoinErrorResponseResult>;
    async sellOrderBooks<T extends FieldsSelector<KuCoinSellOrderBook>>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number
        },
        checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinSellOrderBook, T> | KuCoinErrorResponseResult>;
    async sellOrderBooks<T>(
        parameters: {
            symbol: CurrencyPair,
            group?: number,
            limit?: number
        },
        checkFields?: T
    ): Promise<KuCoinSellOrderBook | FieldsSelectorResult<KuCoinSellOrderBook, T> | KuCoinErrorResponseResult> {
        const rawResponseResult = await request.get(KuCoinConstants.sellOrderBooksUri, {
            baseUrl: this.serverUri,
            qs: {
                symbol: KuCoinUtils.getSymbol(parameters.symbol),
                group: parameters.group,
                limit: parameters.limit
            }
        });

        const responseResult = this.parseRawResponseResult(rawResponseResult, checkFields);
        if (is<KuCoinErrorResponseResult, T>(responseResult, kuCoinErrorResponseResultGuardsMap, checkFields))
            return responseResult;

        if (!(is<KuCoinSellOrderBook, T>(responseResult, kuCoinSellOrderBookGuardsMap, checkFields)))
            throw new Error(`The result ${responseResult} isn't the KuCoin sell order book type.`);
        return responseResult;
    }

    protected parseRawResponseResult<T>(rawResponseResult: string, checkFields: T) {
        const obj = JSON.parse(rawResponseResult);
        if (is(obj, kuCoinResponseResultGuardsMap, checkFields))
            return obj;
        throw new Error(`The result ${rawResponseResult} isn't a KuCoin response result.`);
    }
}
