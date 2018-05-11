import { OrderBook, Order, CurrencyPair, OrderType } from '../../core';
import { isArray, isObject, isString, isNumber } from 'util';

interface YobitOrderContainer {
    type: YobitOrderType,
    price: number,
    amount: number,
}
type YobitOrderType = 'bid' | 'ask';

const isErrorResponseGuard = (data: any): data is { error: string } => data && data.hasOwnProperty('success') && data.success === 0 && data.error;
const isOrderTypeGuard = (type: any): type is YobitOrderType => type === 'bid' || type === 'ask';
const isOrderGuard = (order: any): order is YobitOrderContainer =>
    order.type && isOrderTypeGuard(order.type) && order.price && isNumber(order.price) && order.amount && isNumber(order.amount);
const isOrdersArray = (ordersArray: any): ordersArray is YobitOrderContainer[] => ordersArray && isArray(ordersArray) && ordersArray.every(o => isOrderGuard(o));

export class YobitResponseParser {
    parseOrderBook(data: string, currencyPair: CurrencyPair): OrderBook {
        const dataObject = JSON.parse(data);
        if (!dataObject)
            throw new Error('Data object is empty.');
        if (isErrorResponseGuard(dataObject))
            throw new Error(dataObject.error)
        const rawOrders = dataObject[`${currencyPair[0]}_${currencyPair[1]}`];
        if (!isOrdersArray(rawOrders))
            throw new Error(`Data object does not have the ${currencyPair} property contained array of orders.`);

        const orders = rawOrders.map<Order>(o => ({
            pair: currencyPair,
            price: o.price,
            amount: o.amount,
            orderType: o.type === 'bid' ? OrderType.Buy : OrderType.Sell
        }));

        return {
            buyOrders: orders.filter(o => o.orderType === OrderType.Buy),
            sellOrders: orders.filter(o => o.orderType === OrderType.Sell)
        }
    }
}