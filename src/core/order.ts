import { CurrencyPair } from './currency-pair';

export enum OrderType { Buy, Sell }

export interface Order {
    pair: CurrencyPair,
    price: number,
    amount: number,
    orderType: OrderType;
}

export interface OrderInfo {
    startAmount: number;
    currentAmount: number;
}