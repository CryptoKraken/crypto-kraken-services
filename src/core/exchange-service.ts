import { CurrencyPair } from './currency-pair';
import { Order, OrderInfo } from './order';
import { OrderBook } from './order-book';
import { ExchangeCredentials } from './exchange-credentials';

export interface ExchangeService {
    // Orders
    getOrderBook(pair: CurrencyPair, maxLimit?: number): Promise<OrderBook>;
    getRecentDealOrders(pair: CurrencyPair, maxLimit?: number): Promise<Order[]>;

    // Account orders
    createOrder(order: Order, exchangeCredentials: ExchangeCredentials): Promise<Order & { id: string }>;
    deleteOrder(id: string, exchangeCredentials: ExchangeCredentials): Promise<boolean>;
    getOrderInfo(id: string, exchangeCredentials: ExchangeCredentials): Promise<OrderInfo>;
    getActiveOrders(exchangeCredentials: ExchangeCredentials): Promise<Order & { id: string }[]>;

    getBalance(currency: string, exchangeCredentials: ExchangeCredentials): Promise<number>;
}