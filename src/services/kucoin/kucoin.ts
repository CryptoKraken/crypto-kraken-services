import * as request from 'request-promise-native';
import { ExchangeService, Order, OrderInfo, OrderBook, CurrencyPair, OrderType } from '../../core';
import { RepeatPromise } from '../../utils';

export class KuCoinService implements ExchangeService {
    async getOrderBook(pair: CurrencyPair): Promise<OrderBook> {
        throw new Error("Method not implemented.");
    }

    async getRecentDealOrders(pair: CurrencyPair, maxLimit?: number): Promise<Order[]> {
        throw new Error("Method not implemented.");
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
}