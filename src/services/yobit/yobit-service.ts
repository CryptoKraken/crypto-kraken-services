import { OrderBook, ExchangeService, Order, OrderInfo, CurrencyPair } from '../../core';

export class YobitService implements ExchangeService {
    getOrderBook(pair: CurrencyPair): Promise<OrderBook> {
        throw new Error("Method not implemented.");
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