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
    readonly order: Readonly<Identified<Order>>;
    readonly remainingAmount: number;
    readonly executedAmount: number;
    readonly createdDate: Date;
}
