import * as request from 'request-promise-native';
import {
    AuthenticatedRestExchangeService, CurrencyBalance, CurrencyPair,
    Order, OrderBook, OrderInfo, OrderType, RestExchangeService
} from '../../core';
import { Identified, isIdentified, RepeatPromise } from '../../utils';
import { KuCoinConstants } from './constants';
import { KuCoinResponseParser } from './kucoin-response-parser';

export class KuCoinService implements RestExchangeService, AuthenticatedRestExchangeService {
    private _kuCoinResponseParser: KuCoinResponseParser = new KuCoinResponseParser();
    private _requestTryCount: number;

    constructor(readonly serverUri: string = KuCoinConstants.serverProductionUrl, requestTryCount: number = 3) {
        this._requestTryCount = requestTryCount;
    }

    protected set kuCoinResponseParser(value: KuCoinResponseParser) {
        this._kuCoinResponseParser = value;
    }

    protected get kuCoinResponseParser() {
        return this._kuCoinResponseParser;
    }

    get requestTryCount() {
        return this._requestTryCount;
    }

    set requestTryCount(value: number) {
        this._requestTryCount = value;
    }

    async getOrderBook(pair: CurrencyPair, maxLimit?: number): Promise<OrderBook> {
        return new RepeatPromise<OrderBook>((resolve, reject) => {
            request.get(KuCoinConstants.orderBooksUri, {
                baseUrl: this.serverUri,
                qs: {
                    symbol: this.getSymbol(pair),
                    limit: maxLimit
                }
            })
                .then(value => resolve(this.kuCoinResponseParser.parseOrderBook(value, pair)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    async getTrades(pair: CurrencyPair, maxLimit?: number): Promise<Order[]> {
        return new RepeatPromise<Order[]>((resolve, reject) => {
            request.get(KuCoinConstants.tradesUri, {
                baseUrl: this.serverUri,
                qs: {
                    symbol: this.getSymbol(pair),
                    limit: maxLimit
                }
            })
                .then(value => resolve(this.kuCoinResponseParser.parseTrades(value, pair)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    async createOrder(order: Order): Promise<Identified<Order>> {
        throw new Error('Method not implemented.');
    }

    async deleteOrder(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    async getOrderInfo(id: string): Promise<OrderInfo> {
        throw new Error('Method not implemented.');
    }

    async getActiveOrders(): Promise<Array<Identified<Order>>> {
        throw new Error('Method not implemented.');
    }

    async getBalance(currency: string): Promise<CurrencyBalance> {
        throw new Error('Method not implemented.');
    }

    protected getSymbol(currencyPair: CurrencyPair) {
        return `${currencyPair[0]}-${currencyPair[1]}`;
    }
}
