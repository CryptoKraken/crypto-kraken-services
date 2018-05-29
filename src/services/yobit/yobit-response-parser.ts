import { isArray, isNumber } from 'util';
import { CurrencyPair, Order, OrderBook, OrderType } from '../../core';
import { YobitUtils } from './yobit-utils';

interface YobitTradesItem {
    type: YobitOrderType;
    price: number;
    amount: number;
}

type YobitOrderType = 'bid' | 'ask';

type YobitOrderBookItem = [
    /*price*/ number,
    /*amount*/ number
];

const Guards = {
    isErrorResponse: (data: any): data is { error: string } => {
        return data && data.hasOwnProperty('success') && data.success === 0 && data.error;
    },

    isOrderType: (type: any): type is YobitOrderType => type === 'bid' || type === 'ask',

    isOrderBookItem: (item: any): item is YobitOrderBookItem => {
        return item && isArray(item) && item.length === 2 && isNumber(item[0]) && isNumber(item[1]);
    },

    isOrderBookItemArray: (data: any): data is YobitOrderBookItem[] => {
        return data && isArray(data) && data.every(i => Guards.isOrderBookItem(i));
    },

    isTradesItem: (order: any): order is YobitTradesItem => {
        return order.type && Guards.isOrderType(order.type) && order.price && isNumber(order.price)
            && order.amount && isNumber(order.amount);
    },

    isTradesArray: (ordersArray: any): ordersArray is YobitTradesItem[] => {
        return ordersArray && isArray(ordersArray) && ordersArray.every(o => Guards.isTradesItem(o));
    }
};

export class YobitResponseParser {
    parseOrderBook(data: string, pair: CurrencyPair): OrderBook {
        const dataObject = JSON.parse(data);
        if (!dataObject)
            throw new Error('Data object is empty.');
        if (Guards.isErrorResponse(dataObject))
            throw new Error(dataObject.error);
        const pairSymbol = YobitUtils.getPairSymbol(pair);
        const orderBookContainer = dataObject[pairSymbol];
        if (!orderBookContainer)
            throw new Error(`Data object does not have the ${pairSymbol} property.`);
        const rawSellOrders = orderBookContainer.asks;
        const rawBuyOrders = orderBookContainer.bids;
        if (!Guards.isOrderBookItemArray(rawSellOrders) || !Guards.isOrderBookItemArray(rawBuyOrders))
            throw new Error('Data object does not have the asks or bids property contained array of orders');

        return {
            buyOrders: this.getOrders(rawBuyOrders, pair, OrderType.Buy),
            sellOrders: this.getOrders(rawSellOrders, pair, OrderType.Sell)
        };
    }

    parseTrades(data: string, pair: CurrencyPair): Order[] {
        const dataObject = JSON.parse(data);
        if (!dataObject)
            throw new Error('Data object is empty.');
        if (Guards.isErrorResponse(dataObject))
            throw new Error(dataObject.error);
        const pairSymbol = YobitUtils.getPairSymbol(pair);
        const rawTrades = dataObject[pairSymbol];
        if (!Guards.isTradesArray(rawTrades))
            throw new Error(`Data object does not have the ${pairSymbol} property contained array of orders.`);

        return rawTrades.map<Order>(o => ({
            pair,
            price: o.price,
            amount: o.amount,
            orderType: o.type === 'bid' ? OrderType.Buy : OrderType.Sell
        }));
    }

    private getOrders(items: YobitOrderBookItem[], pair: CurrencyPair, type: OrderType): Order[] {
        return items.map<Order>(o => ({
            price: o[0],
            amount: o[1],
            pair,
            orderType: type
        }));
    }
}
