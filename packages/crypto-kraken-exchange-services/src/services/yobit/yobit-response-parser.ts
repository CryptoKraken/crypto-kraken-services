import { isArray, isNumber } from 'util';
import { CurrencyBalance, CurrencyPair, Order, OrderBook, OrderType } from '../../core';
import { Identified } from '../../utils/identifier';
import { YobitUtils } from './yobit-utils';

interface YobitTrade {
    type: YobitOrderType;
    price: number;
    amount: number;
}

type YobitOrderType = 'bid' | 'ask';

type YobitOrder = [
    /*price*/ number,
    /*amount*/ number
];

interface YobitSuccessResponseResult {
    success: 1;
    return: any;
}

interface YobitErrorResponseResult {
    success: 0;
    error: string;
}

interface YobitBalance {
    funds: any;
    funds_incl_orders: any;
}

interface YobitCreateOrderInfo {
    order_id: number;
}

const Guards = {
    YobitErrorResponseResult: (data: any): data is YobitErrorResponseResult => {
        return data && data.hasOwnProperty('success') && data.success === 0 && data.error;
    },

    isYobitOrderType: (data: any): data is YobitOrderType => data === 'bid' || data === 'ask',

    isYobitOrder: (data: any): data is YobitOrder => {
        return data && isArray(data) && data.length === 2 && isNumber(data[0]) && isNumber(data[1]);
    },

    isYobitOrderArray: (data: any): data is YobitOrder[] => {
        return data && isArray(data) && data.every(i => Guards.isYobitOrder(i));
    },

    isYobitTrade: (data: any): data is YobitTrade => {
        return data.type && Guards.isYobitOrderType(data.type) && data.price && isNumber(data.price)
            && data.amount && isNumber(data.amount);
    },

    isYobitTradeArray: (data: any): data is YobitTrade[] => {
        return data && isArray(data) && data.every(o => Guards.isYobitTrade(o));
    },

    isYobitSuccessResponseResult: (data: any): data is YobitSuccessResponseResult => {
        return data && data.success && data.success === 1 && data.return;
    },

    isYobitBalance: (data: any): data is YobitBalance => {
        return data && data.funds && data.funds_incl_orders;
    },

    isYobitCreateOrderInfo: (data: any): data is YobitCreateOrderInfo => {
        return data && data.hasOwnProperty('order_id') && isNumber(data.order_id);
    }
};

export class YobitResponseParser {
    parseOrderBook(data: string, pair: CurrencyPair): OrderBook {
        const dataObject = JSON.parse(data);
        if (!dataObject)
            throw new Error('Data object is empty.');
        if (Guards.YobitErrorResponseResult(dataObject))
            throw new Error(dataObject.error);
        const pairSymbol = YobitUtils.getPairSymbol(pair);
        const orderBookContainer = dataObject[pairSymbol];
        if (!orderBookContainer)
            throw new Error(`Data object does not have the ${pairSymbol} property.`);
        const rawSellOrders = orderBookContainer.asks;
        const rawBuyOrders = orderBookContainer.bids;
        if (!Guards.isYobitOrderArray(rawSellOrders) || !Guards.isYobitOrderArray(rawBuyOrders))
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
        if (Guards.YobitErrorResponseResult(dataObject))
            throw new Error(dataObject.error);
        const pairSymbol = YobitUtils.getPairSymbol(pair);
        const yobitTrades = dataObject[pairSymbol];
        if (!Guards.isYobitTradeArray(yobitTrades))
            throw new Error(`Data object does not have the ${pairSymbol} property contained array of orders.`);

        return yobitTrades.map<Order>(o => ({
            pair,
            price: o.price,
            amount: o.amount,
            orderType: o.type === 'bid' ? OrderType.Buy : OrderType.Sell
        }));
    }

    parseCreateOrder(data: string, order: Order): Identified<Order> {
        const dataObject = this.getYobitResponseResult(JSON.parse(data));
        if (!Guards.isYobitCreateOrderInfo(dataObject.return))
            throw new Error('Data object does not contain the \'order_id\' property');
        return { ...order, id: dataObject.return.order_id.toString() };
    }

    parseBalance(data: string, currency: string): CurrencyBalance {
        const dataObject = this.getYobitResponseResult(JSON.parse(data));
        if (!Guards.isYobitBalance(dataObject.return))
            throw new Error('Data object does not contain the \'funds\' or the \'funds_incl_orders\' property');

        const allAmount = dataObject.return.funds_incl_orders[currency];
        const freeAmount = dataObject.return.funds[currency];
        if (allAmount === undefined || !isNumber(allAmount)
            || freeAmount === undefined || !isNumber(freeAmount))
            throw new Error(`Data object does not contain data for ${currency} currency`);

        return {
            allAmount,
            freeAmount,
            lockedAmount: allAmount - freeAmount
        };
    }

    private getOrders(items: YobitOrder[], pair: CurrencyPair, type: OrderType): Order[] {
        return items.map<Order>(o => ({
            price: o[0],
            amount: o[1],
            pair,
            orderType: type
        }));
    }

    private getYobitResponseResult(dataObject: any): YobitSuccessResponseResult {
        if (!dataObject)
            throw new Error('Data object is empty.');
        if (Guards.YobitErrorResponseResult(dataObject))
            throw new Error(dataObject.error);
        if (!Guards.isYobitSuccessResponseResult(dataObject))
            throw new Error('Data object does not contain the \'return\' property');
        return dataObject;
    }
}
