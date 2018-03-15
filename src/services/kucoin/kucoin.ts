import * as request from 'request-promise-native';
import { ExchangeService, Order, OrderInfo, OrderBook, CurrencyPair, OrderType } from '../../core';
import { RepeatPromise } from '../../utils';
import { KuCoinResponseParser } from './kucoin-responce-parser';

const KUCOIN_DEFAULT_SERVER_PRODUCTION_URI = 'https://api.kucoin.com';
const KUCOIN_DEFAULT_RECENTLY_DEAL_ORDERS_URI = '/v1/open/deal-orders';

export class KuCoinService implements ExchangeService {
    private _kuCoinResponseParser: KuCoinResponseParser = new KuCoinResponseParser();;

    constructor(public readonly serverUri: string = KUCOIN_DEFAULT_SERVER_PRODUCTION_URI, public readonly requestTryCount: number = 3) {
    }

    protected set kuCoinResponseParser(value: KuCoinResponseParser) {
        this._kuCoinResponseParser = value;
    }

    protected get kuCoinResponseParser() {
        return this._kuCoinResponseParser;
    }

    async getOrderBook(pair: CurrencyPair): Promise<OrderBook> {
        throw new Error("Method not implemented.");
    }

    async getRecentDealOrders(pair: CurrencyPair, maxLimit?: number): Promise<Order[]> {
        return new RepeatPromise<Order[]>((resolve, reject) => {
            request(KUCOIN_DEFAULT_RECENTLY_DEAL_ORDERS_URI, {
                baseUrl: this.serverUri,
                method: 'GET',
                qs: {
                    symbol: this.getSymbol(pair),
                    limit: maxLimit
                }
            })
                .then(value => resolve(this.kuCoinResponseParser.parseOrders(pair, value)))
                .catch(reason => reject(reason));
        });
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