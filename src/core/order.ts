import { Identified } from '../utils';
import { CurrencyPair } from './currency-pair';

export enum OrderType { Buy, Sell }

export interface Order {
    pair: CurrencyPair;
    price: number;
    amount: number;
    orderType: OrderType;
}

export interface OrderInfo {
    order: Identified<Order>;
    startAmount: number;
    currentAmount: number;
    remainingAmount: number;
}
