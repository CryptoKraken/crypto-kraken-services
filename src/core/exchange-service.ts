import { CurrencyPair } from './currency-pair';
import { Order, OrderInfo } from './order';
import { OrderBook } from './order-book';
import { RepeatPromise } from '../utils';

export interface ExchangeService {
    // Orders
    getOrderBook(pair: CurrencyPair): RepeatPromise<OrderBook>;
    getRecentDealOrders(pair: CurrencyPair, maxLimit?: number): RepeatPromise<Order[]>;

    // Account orders
    createOrder(order: Order): RepeatPromise<Order & { id: string }>;
    deleteOrder(id: string): RepeatPromise<boolean>;
    getOrderInfo(id: string): RepeatPromise<OrderInfo>;
    getActiveOrders(): RepeatPromise<Order & { id: string }[]>;

    getBalance(currency: string): RepeatPromise<number>;
}