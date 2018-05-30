import { isArray, isNumber, isString } from 'util';
import { CurrencyPair, Order, OrderBook, OrderType } from '../../core';

type KucoinOrder = [
    /*Price*/ number,
    /*Amount*/ number,
    /*Volume*/ number
];

interface KucoinOrderBook {
    SELL: KucoinOrder[];
    BUY: KucoinOrder[];
}

type KucoinTrade = [
    /*Timestamp*/ number,
    /*Order Type*/ string,
    /*Price*/ number,
    /*Amount*/ number,
    /*Volume*/ number
];

const Guards = {
    isDataObjOwner: (data: any): data is { data: any } => data && data.data,

    isDataArrayOwner: (data: any): data is { data: any[] } => {
        return Guards.isDataObjOwner(data) && isArray(data.data);
    },

    isKucoinOrderBook: (data: any): data is KucoinOrderBook => {
        return data && data.SELL && data.BUY
            && isArray(data.SELL) && isArray(data.BUY)
            && data.SELL.every((order: any) => Guards.isKucoinOrder(order))
            && data.BUY.every((order: any) => Guards.isKucoinOrder(order));
    },

    isKucoinOrder: (data: any): data is KucoinOrder => {
        return data && isNumber(data[0]) && isNumber(data[1]) && isNumber(data[2]);
    },

    isKucoinTrade: (data: any): data is KucoinTrade => {
        return data && isNumber(data[0]) && isString(data[1]) && Guards.isOrderType(data[1])
            && isNumber(data[2]) && isNumber(data[3]) && isNumber(data[4]);
    },

    isOrderType: (orderType: any): orderType is 'SELL' | 'BUY' => orderType === 'SELL' || orderType === 'BUY'
};

export class KuCoinResponseParser {
    parseOrderBook(responseResult: string, currencyPair: CurrencyPair): OrderBook {
        const obj = JSON.parse(responseResult);
        if (!Guards.isDataObjOwner(obj) || !Guards.isKucoinOrderBook(obj.data))
            throw new Error(`The result ${responseResult} isn't the order book type.`);
        const kucoinOrderBook = obj.data;
        return {
            buyOrders: kucoinOrderBook.BUY
                .map(order => {
                    return {
                        amount: order[1],
                        orderType: OrderType.Buy,
                        pair: currencyPair,
                        price: order[0]
                    };
                }),
            sellOrders: kucoinOrderBook.SELL
                .map(order => {
                    return {
                        amount: order[1],
                        orderType: OrderType.Sell,
                        pair: currencyPair,
                        price: order[0]
                    };
                }),
        };
    }

    parseTrades(responseResult: string, currencyPair: CurrencyPair): Order[] {
        const obj = JSON.parse(responseResult);
        if (!Guards.isDataArrayOwner(obj))
            throw new Error(`The result ${responseResult} isn't the orders type.`);

        return obj.data.map<Order>(orderObj => {
            if (!Guards.isKucoinTrade(orderObj))
                throw new Error(`The element (${orderObj}) of the orders object isn't the trade type.`);

            return {
                amount: orderObj[3],
                orderType: orderObj[1] === 'SELL' ? OrderType.Sell : OrderType.Buy,
                pair: currencyPair,
                price: orderObj[2]
            };
        });
    }

}
