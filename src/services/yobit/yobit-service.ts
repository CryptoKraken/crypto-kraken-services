import * as request from 'request-promise-native';
import { CurrencyPair, ExchangeService, Order, OrderBook, OrderInfo } from '../../core';
import { RepeatPromise } from '../../utils';
import { YobitConstants } from './constants';
import { YobitResponseParser } from './yobit-response-parser';

export class YobitService implements ExchangeService {
    private responseParser: YobitResponseParser;

    constructor(
        public requestTryCount: number = 3
    ) {
        this.responseParser = new YobitResponseParser();
    }

    getOrderBook(pair: CurrencyPair, maxLimit?: number): Promise<OrderBook> {
        throw new Error('Method not implemented.');
    }

    getRecentDealOrders(pair: CurrencyPair, maxLimit?: number | undefined): Promise<Order[]> {
        return new RepeatPromise((resolve, reject) => {
            request.get(YobitConstants.getTradesUri(pair), {
                baseUrl: YobitConstants.rootServerUrl,
                qs: maxLimit ? { limit: maxLimit } : undefined
            })
                .then(value => resolve(this.responseParser.parseTrades(value, pair)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    createOrder(order: Order): Promise<Order & { id: string; }> {
        throw new Error('Method not implemented.');
    }
    deleteOrder(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    getOrderInfo(id: string): Promise<OrderInfo> {
        throw new Error('Method not implemented.');
    }
    getActiveOrders(): Promise<Array<Order & { id: string; }>> {
        throw new Error('Method not implemented.');
    }
    getBalance(currency: string): Promise<number> {
        throw new Error('Method not implemented.');
    }
}
