import * as request from 'request-promise-native';
import { ExchangeService, Order, OrderInfo, OrderBook, CurrencyPair, OrderType } from '../../core';
import { RepeatPromise } from '../../utils';
import { KuCoinResponseParser } from './kucoin-response-parser';
import { KuCoinConstants } from './constants';

export class KuCoinService implements ExchangeService {
    private _kuCoinResponseParser: KuCoinResponseParser = new KuCoinResponseParser();
    private _requestTryCount: number;

    constructor(public readonly serverUri: string = KuCoinConstants.serverProductionUrl, requestTryCount: number = 3) {
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
                method: 'GET',
                qs: {
                    symbol: this.getSymbol(pair),
                    limit: maxLimit
                }
            })
                .then(value => resolve(this.kuCoinResponseParser.parseOrderBook(pair, value)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    async getRecentDealOrders(pair: CurrencyPair, maxLimit?: number): Promise<Order[]> {
        return new RepeatPromise<Order[]>((resolve, reject) => {
            request.get(KuCoinConstants.recentlyDealOrdersUri, {
                baseUrl: this.serverUri,
                method: 'GET',
                qs: {
                    symbol: this.getSymbol(pair),
                    limit: maxLimit
                }
            })
                .then(value => resolve(this.kuCoinResponseParser.parseDealOrders(pair, value)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    async createOrder(order: Order): Promise<Order & { id: string; }> {
        throw new Error("Method not implemented.");
    }

    async deleteOrder(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async getOrderInfo(id: string): Promise<OrderInfo> {
        throw new Error("Method not implemented.");
    }

    async getActiveOrders(): Promise<Order & { id: string; }[]> {
        throw new Error("Method not implemented.");
    }

    async getBalance(currency: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    protected getSymbol(currencyPair: CurrencyPair) {
        return `${currencyPair[0]}-${currencyPair[1]}`;
    }
}