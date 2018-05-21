import { OrderBook, ExchangeService, Order, OrderInfo, CurrencyPair } from '../../core';
import { RepeatPromise } from '../../utils';
import * as request from 'request-promise-native';
import { YobitConstants } from './constants'
import { YobitResponseParser } from './yobit-response-parser';

export class YobitService implements ExchangeService {
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
    getRecentDealOrders(pair: CurrencyPair, maxLimit?: number | undefined): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    createOrder(order: Order): Promise<Order & { id: string; }> {
        throw new Error("Method not implemented.");
    }
    deleteOrder(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getOrderInfo(id: string): Promise<OrderInfo> {
        throw new Error("Method not implemented.");
    }
    getActiveOrders(): Promise<Order & { id: string; }[]> {
        throw new Error("Method not implemented.");
    }
    getBalance(currency: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
}