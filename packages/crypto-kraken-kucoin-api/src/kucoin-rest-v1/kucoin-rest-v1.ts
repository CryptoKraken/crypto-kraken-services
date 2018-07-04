import { CurrencyPair, FieldsSelector, FieldsSelectorResult, is } from 'crypto-kraken-core';
import * as request from 'request-promise-native';
import { KuCoinConstants } from './kucoin-constants';
import {
    kuCoinAllCoinsTickGuardsMap,
    kuCoinBuyOrderBookGuardsMap,
    kuCoinErrorResponseResultGuardsMap,
    kuCoinListExchangeRateOfCoinsGuardsMap,
    kuCoinListLanguagesGuardsMap,
    kuCoinOrderBookGuardsMap,
    kuCoinResponseResultGuardsMap,
    kuCoinSellOrderBookGuardsMap,
    kuCoinTickGuardsMap
} from './kucoin-guards';
import {
    KuCoinAllCoinsTick,
    KuCoinBuyOrderBook,
    KuCoinErrorResponseResult,
    KuCoinListExchangeRateOfCoins,
    KuCoinListLanguages,
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

    async listExchangeRateOfCoins(parameters?: {
        coins?: string[]
    }): Promise<KuCoinListExchangeRateOfCoins | KuCoinErrorResponseResult>;
    async listExchangeRateOfCoins<T extends FieldsSelector<KuCoinListExchangeRateOfCoins>>(
        parameters?: { coins?: string[] }, checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinListExchangeRateOfCoins, T> | KuCoinErrorResponseResult>;
    async listExchangeRateOfCoins<T>(
        parameters?: { coins?: string[] }, checkFields?: T
    ): Promise<KuCoinListExchangeRateOfCoins | FieldsSelectorResult<KuCoinListExchangeRateOfCoins, T> |
    KuCoinErrorResponseResult> {
        const requestOptions: request.RequestPromiseOptions = {
            baseUrl: this.serverUri
        };
        if (parameters && parameters.coins && parameters.coins.length > 0)
            requestOptions.qs = {
                coins: parameters.coins.join(',')
            };
        const rawResponseResult = await request.get(KuCoinConstants.listExchangeRateOfCoinsUri, requestOptions);

        const responseResult = this.parseRawResponseResult(rawResponseResult, checkFields);
        if (is<KuCoinErrorResponseResult, T>(responseResult, kuCoinErrorResponseResultGuardsMap, checkFields))
            return responseResult;

        if (!(is<KuCoinListExchangeRateOfCoins, T>(
            responseResult, kuCoinListExchangeRateOfCoinsGuardsMap, checkFields
        )))
            throw new Error(`The result ${responseResult} isn't the KuCoin list exchange rate of coins type.`);
        return responseResult;
    }

    async listLanguages(): Promise<KuCoinListLanguages | KuCoinErrorResponseResult>;
    async listLanguages<T extends FieldsSelector<KuCoinListLanguages>>(
        checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinListLanguages, T> | KuCoinErrorResponseResult>;
    async listLanguages<T extends FieldsSelector<KuCoinListLanguages>>(
        checkFields?: T
    ): Promise<KuCoinListLanguages | FieldsSelectorResult<KuCoinListLanguages, T> | KuCoinErrorResponseResult> {
        const rawResponseResult = await request.get(KuCoinConstants.listLanguages, {
            baseUrl: this.serverUri
        });

        const responseResult = this.parseRawResponseResult(rawResponseResult, checkFields);
        if (is<KuCoinErrorResponseResult, T>(responseResult, kuCoinErrorResponseResultGuardsMap, checkFields))
            return responseResult;

        if (!(is<KuCoinListLanguages, T>(responseResult, kuCoinListLanguagesGuardsMap, checkFields)))
            throw new Error(`The result ${responseResult} isn't the KuCoin language list type.`);
        return responseResult;
    }

    async tick(): Promise<KuCoinAllCoinsTick | KuCoinErrorResponseResult>;
    async tick(parameters: { symbol: CurrencyPair }): Promise<KuCoinTick | KuCoinErrorResponseResult>;
    async tick(
        parameters: { symbol?: CurrencyPair }
    ): Promise<KuCoinAllCoinsTick | KuCoinTick | KuCoinErrorResponseResult>;
    async tick<T extends FieldsSelector<KuCoinAllCoinsTick>>(
        parameters: undefined, checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinAllCoinsTick, T> | KuCoinErrorResponseResult>;
    async tick<T extends FieldsSelector<KuCoinTick>>(
        parameters: { symbol: CurrencyPair }, checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinTick, T> | KuCoinErrorResponseResult>;
    async tick<T extends FieldsSelector<KuCoinTick>>(
        parameters: { symbol?: CurrencyPair }, checkFields?: T
    ): Promise<FieldsSelectorResult<KuCoinAllCoinsTick | KuCoinTick, T> | KuCoinErrorResponseResult>;
    async tick<T>(
        parameters?: { symbol?: CurrencyPair }, checkFields?: T
    ): Promise<
    KuCoinAllCoinsTick | KuCoinTick | FieldsSelectorResult<KuCoinAllCoinsTick, T> |
    FieldsSelectorResult<KuCoinTick, T> | KuCoinErrorResponseResult
    > {
        const isAllCoins = !(parameters && parameters.symbol);
        const requestOptions: request.RequestPromiseOptions = {
            baseUrl: this.serverUri
        };
        if (!isAllCoins)
            requestOptions.qs = {
                // The result of checking of parameters and symbol fields is saved in the isAllCoins constant above
                symbol: KuCoinUtils.getSymbol(parameters!.symbol!)
            };
        const rawResponseResult = await request.get(KuCoinConstants.tickUri, requestOptions);

        const responseResult = this.parseRawResponseResult(rawResponseResult, checkFields);
        if (is<KuCoinErrorResponseResult, T>(responseResult, kuCoinErrorResponseResultGuardsMap, checkFields))
            return responseResult;

        if ((isAllCoins && is<KuCoinAllCoinsTick, T>(responseResult, kuCoinAllCoinsTickGuardsMap, checkFields)) ||
            (!isAllCoins && is<KuCoinTick, T>(responseResult, kuCoinTickGuardsMap, checkFields)))
            return responseResult;
        throw new Error(`The result ${responseResult} isn't the KuCoin tick type.`);
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
