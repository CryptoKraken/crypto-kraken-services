import { isArray, isNumber } from 'util';
import { CurrencyBalance, CurrencyPair, Order, OrderBook, OrderInfo, OrderType } from '../../../core';
import { Identified } from '../../../utils/identifier';
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

interface YobitResponseResultWithOrderId extends YobitSuccessResponseResult {
    return: {
        order_id: number;
    };
}
interface YobitOrderInfo extends YobitSuccessResponseResult {
    return: {
        [key: string]: {
            start_amount: number,
            amount: number,
            timestamp_created: number,
        }
    };
}
const Guards = {
    YobitErrorResponseResult: (data: any): data is YobitErrorResponseResult => {
        return data && data.success === 0 && data.error;
    },

    isYobitOrderType: (data: any): data is YobitOrderType => data === 'bid' || data === 'ask',

    isYobitOrder: (data: any): data is YobitOrder => {
        return data && isArray(data) && data.length === 2 && isNumber(data[0]) && isNumber(data[1]);
    },

    isYobitOrderArray: (data: any): data is YobitOrder[] => {
        return data && isArray(data) && data.every(i => Guards.isYobitOrder(i));
    },

    isYobitTrade: (data: any): data is YobitTrade => {
        return data && Guards.isYobitOrderType(data.type) && isNumber(data.price) && isNumber(data.amount);
    },

    isYobitTradeArray: (data: any): data is YobitTrade[] => {
        return data && isArray(data) && data.every(o => Guards.isYobitTrade(o));
    },

    isYobitSuccessResponseResult: (data: any): data is YobitSuccessResponseResult => {
        return data && data.success === 1 && data.return;
    },

    isYobitZeroBalance: (data: any): data is any => data && !data.funds && !data.funds_incl_orders,

    isYobitBalance: (data: any): data is YobitBalance => data && data.funds && data.funds_incl_orders,

    isYobitResponseResultWithOrderId: (data: YobitSuccessResponseResult): data is YobitResponseResultWithOrderId => {
        return data && data.return && typeof data.return.order_id === 'number';
    },

    isYobitOrderInfo: (data: YobitSuccessResponseResult): data is YobitOrderInfo => {
        const order = data.return[Object.keys(data.return)[0]];
        return order && typeof order.start_amount === 'number' && typeof order.amount === 'number'
            && typeof order.timestamp_created === 'number';
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
        const dataObject = this.getYobitResponseResultWithOrderId(data);
        return { ...order, id: dataObject.return.order_id.toString() };
    }

    parseOrderInfo(data: string, order: Identified<Order>): OrderInfo {
        const result = this.getYobitSuccessResponseResult(data);
        if (!Guards.isYobitOrderInfo(result))
            throw new Error('Data object does not correspond to the order info type');

        const orderId = Object.keys(result.return)[0];
        const orderInfo = result.return[orderId];
        return {
            createdDate: new Date(orderInfo.timestamp_created),
            remainingAmount: orderInfo.amount,
            executedAmount: orderInfo.start_amount - orderInfo.amount,
            order
        };
    }

    parseDeleteOrder(data: string, orderId: string): void {
        const dataObject = this.getYobitResponseResultWithOrderId(data);
        if (dataObject.return.order_id.toString() !== orderId)
            throw new Error('Data object contains incorrect order id');
    }

    parseBalance(data: string, currency: string): CurrencyBalance {
        const dataObject = this.getYobitSuccessResponseResult(data);
        let allAmount = 0;
        let freeAmount = 0;

        if (Guards.isYobitBalance(dataObject.return)) {
            if (!isNumber(dataObject.return.funds_incl_orders[currency])
                || !isNumber(dataObject.return.funds[currency]))
                throw new Error(`Data object does not contain data for ${currency} currency`);

            allAmount = dataObject.return.funds_incl_orders[currency];
            freeAmount = dataObject.return.funds[currency];
        } else if (!Guards.isYobitZeroBalance(dataObject.return))
            throw new Error('Data object does not contain the \'funds\' or the \'funds_incl_orders\' property');

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

    private getYobitSuccessResponseResult(data: string): YobitSuccessResponseResult {
        const dataObject = JSON.parse(data);
        if (!dataObject)
            throw new Error('Data object is empty.');
        if (Guards.YobitErrorResponseResult(dataObject))
            throw new Error(dataObject.error);
        if (!Guards.isYobitSuccessResponseResult(dataObject))
            throw new Error('Data object does not contain the \'return\' property');
        return dataObject;
    }

    private getYobitResponseResultWithOrderId(data: string): YobitResponseResultWithOrderId {
        const result = this.getYobitSuccessResponseResult(data);
        if (!Guards.isYobitResponseResultWithOrderId(result))
            throw new Error('Data object does not contain the \'order_id\' property');
        return result;
    }
}
