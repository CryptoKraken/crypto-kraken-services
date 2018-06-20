import { Identified } from '../utils';
import { CurrencyBalance } from './currency-balance';
import { CurrencyPair } from './currency-pair';
import { ExchangeCredentials } from './exchange-credentials';
import { Order, OrderInfo } from './order';
import { OrderBook } from './order-book';

export interface RestExchangeService {
    getOrderBook(pair: CurrencyPair, maxLimit?: number): Promise<OrderBook>;
    getTrades(pair: CurrencyPair, maxLimit?: number): Promise<Order[]>;
}

export interface AuthenticatedRestExchangeService {
    createOrder(order: Order, exchangeCredentials: ExchangeCredentials): Promise<Identified<Order>>;
    deleteOrder(identifiedOrder: Identified<Order>, exchangeCredentials: ExchangeCredentials): Promise<void>;
    getActiveOrders(pair: CurrencyPair, exchangeCredentials: ExchangeCredentials): Promise<Array<Identified<Order>>>;
    getOrderInfo(identifiedOrder: Identified<Order>, exchangeCredentials: ExchangeCredentials): Promise<OrderInfo>;

    getBalance(currency: string, exchangeCredentials: ExchangeCredentials): Promise<CurrencyBalance>;
}
