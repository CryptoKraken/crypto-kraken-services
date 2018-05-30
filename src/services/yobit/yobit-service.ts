import * as request from 'request-promise-native';
import {
    AuthenticatedRestExchangeService, CurrencyBalance, CurrencyPair,
    Order, OrderBook, OrderInfo, RestExchangeService
} from '../../core';
import { Identified, RepeatPromise } from '../../utils';
import { YobitConstants } from './constants';
import { YobitResponseParser } from './yobit-response-parser';

export class YobitService implements RestExchangeService, AuthenticatedRestExchangeService {
    private responseParser: YobitResponseParser;

    constructor(
        public requestTryCount: number = 3
    ) {
        this.responseParser = new YobitResponseParser();
    }

    getOrderBook(pair: CurrencyPair, maxLimit?: number): Promise<OrderBook> {
        return new RepeatPromise((resolve, reject) => {
            request.get(YobitConstants.getOrderBookUri(pair), {
                baseUrl: YobitConstants.rootServerUrl,
                qs: maxLimit ? { limit: maxLimit } : undefined
            })
                .then(value => resolve(this.responseParser.parseOrderBook(value, pair)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    getTrades(pair: CurrencyPair, maxLimit?: number): Promise<Order[]> {
        return new RepeatPromise((resolve, reject) => {
            request.get(YobitConstants.getTradesUri(pair), {
                baseUrl: YobitConstants.rootServerUrl,
                qs: maxLimit ? { limit: maxLimit } : undefined
            })
                .then(value => resolve(this.responseParser.parseTrades(value, pair)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    createOrder(order: Order): Promise<Identified<Order>> {
        throw new Error('Method not implemented.');
    }
    deleteOrder(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    getOrderInfo(id: string): Promise<OrderInfo> {
        throw new Error('Method not implemented.');
    }
    getActiveOrders(): Promise<Array<Identified<Order>>> {
        throw new Error('Method not implemented.');
    }
    getBalance(currency: string): Promise<CurrencyBalance> {
        throw new Error('Method not implemented.');
    }
}
