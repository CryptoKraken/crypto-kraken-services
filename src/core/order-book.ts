import { Order } from './order';

export interface OrderBook {
    buyOrders: Order[];
    sellOrders: Order[];
}
