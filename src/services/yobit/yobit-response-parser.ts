import { OrderBook, Order, CurrencyPair, OrderType } from '../../core';
import { isArray, isNumber } from 'util';
import { YobitUtils } from './yobit-utils';

interface YobitOrderContainer {
    type: YobitOrderType,
    price: number,
    amount: number,
}
type YobitOrderType = 'bid' | 'ask';

const Guards = {
    isErrorResponse: (data: any): data is { error: string } => data && data.hasOwnProperty('success') && data.success === 0 && data.error,
    isOrderType: (type: any): type is YobitOrderType => type === 'bid' || type === 'ask',
    isOrder: (order: any): order is YobitOrderContainer =>
        order.type && Guards.isOrderType(order.type) && order.price && isNumber(order.price) && order.amount && isNumber(order.amount),
    isOrdersArray: (ordersArray: any): ordersArray is YobitOrderContainer[] => ordersArray && isArray(ordersArray) && ordersArray.every(o => Guards.isOrder(o))
}

export class YobitResponseParser {
    parseOrderBook(data: string, pair: CurrencyPair): OrderBook {
        const dataObject = JSON.parse(data);
        if (!dataObject)
            throw new Error('Data object is empty.');
        if (Guards.isErrorResponse(dataObject))
            throw new Error(dataObject.error);
        const rawOrders = dataObject[YobitUtils.getPairSymbol(pair)];
        if (!Guards.isOrdersArray(rawOrders))
            throw new Error(`Data object does not have the ${pair} property contained array of orders.`);

        const orders = rawOrders.map<Order>(o => ({
            pair: pair,
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