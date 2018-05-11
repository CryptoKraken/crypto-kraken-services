import { OrderBook, ExchangeService, Order, OrderInfo, CurrencyPair } from '../../core';
import { RepeatPromise } from '../../utils';
import * as request from 'request-promise-native';
import { YobitResponseParser } from './yobit-response-parser';

const YOBIT_API_ROOT_URL = 'https://yobit.net/api/3/';
const GET_ORDER_BOOK_METHOD_NAME = 'trades';

export class YobitService implements ExchangeService {
    private responseParser: YobitResponseParser;
    constructor(
        public tryCount: number = 3
    ) {
        this.responseParser = new YobitResponseParser();
    }
    getOrderBook(pair: CurrencyPair): Promise<OrderBook> {
        return new RepeatPromise((resolve, reject) => {
            const url = `${YOBIT_API_ROOT_URL}${GET_ORDER_BOOK_METHOD_NAME}/${pair[0]}_${pair[1]}`;
            request.get(url, (error, response, body) => {
                if (error)
                    reject(error);
                resolve(this.responseParser.parseOrderBook(body, pair));
            });
        });
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