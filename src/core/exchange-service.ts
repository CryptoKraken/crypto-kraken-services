import { CurrencyPair } from './currency-pair';
import { Order, OrderInfo } from './order';
import { OrderBook } from './order-book';

export interface ExchangeService {
    // Orders
    getOrderBook(pair: CurrencyPair, maxLimit?: number): Promise<OrderBook>;
    getRecentDealOrders(pair: CurrencyPair, maxLimit?: number): Promise<Order[]>;

    // Account orders
    createOrder(order: Order): Promise<Order & { id: string }>;
    deleteOrder(id: string): Promise<boolean>;
    getOrderInfo(id: string): Promise<OrderInfo>;
    getActiveOrders(): Promise<Order & { id: string }[]>;

    getBalance(currency: string): Promise<number>;
}