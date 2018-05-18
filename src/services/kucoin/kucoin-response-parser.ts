import { isArray, isNumber, isString } from 'util';
import { Order, OrderType, CurrencyPair, OrderBook } from '../../core';

type OrderResponseResult = [
    /*Price*/ number,
    /*Amount*/ number,
    /*Volume*/ number
];

type OrderBookResponseResult = {
    'SELL': OrderResponseResult[],
    'BUY': OrderResponseResult[]
};

type DealOrderResponseResult = [
    /*Timestamp*/ number,
    /*Order Type*/ string,
    /*Price*/ number,
    /*Amount*/ number,
    /*Volume*/ number
];

const Guards = {
    isDataObjOwner: (dataOwner: any): dataOwner is { data: any } => dataOwner && dataOwner.data,
    isDataArrayOwner: (dataOwner: any): dataOwner is { data: any[] } => Guards.isDataObjOwner(dataOwner) && isArray(dataOwner.data),
    isOrderBook: (orderBook: any): orderBook is OrderBookResponseResult => {
        return orderBook && orderBook['SELL'] && orderBook['BUY']
            && isArray(orderBook['SELL']) && isArray(orderBook['BUY'])
            && orderBook['SELL'].every((order: any) => Guards.isOrder(order))
            && orderBook['BUY'].every((order: any) => Guards.isOrder(order));
    },
    isOrder: (order: any): order is OrderResponseResult => {
        return order && isNumber(order[0]) && isNumber(order[1]) && isNumber(order[2]);
    },
    isDealOrder: (dealOrder: any): dealOrder is DealOrderResponseResult => {
        return dealOrder && isNumber(dealOrder[0]) && isString(dealOrder[1])
            && isNumber(dealOrder[2]) && isNumber(dealOrder[3]) && isNumber(dealOrder[4]);
    },
    isOrderType: (orderType: string): orderType is 'SELL' | 'BUY' => orderType === 'SELL' || orderType === 'BUY'
};

export class KuCoinResponseParser {
    parseOrderBook(currencyPair: CurrencyPair, responseResult: string): OrderBook {
        const obj = JSON.parse(responseResult);
        if (!Guards.isDataObjOwner(obj) || !Guards.isOrderBook(obj.data))
            throw new Error(`The result ${responseResult} isn't the order book type.`);
        const orderBookResponseResult = obj.data;
        return {
            buyOrders: orderBookResponseResult['BUY']
                .map(order => {
                    return {
                        amount: order[1],
                        orderType: OrderType.Buy,
                        pair: currencyPair,
                        price: order[0]
                    }
                }),
            sellOrders: orderBookResponseResult['SELL']
                .map(order => {
                    return {
                        amount: order[1],
                        orderType: OrderType.Sell,
                        pair: currencyPair,
                        price: order[0]
                    }
                }),
        }
    }

    parseDealOrders(currencyPair: CurrencyPair, responseResult: string): Order[] {
        const obj = JSON.parse(responseResult);
        if (!Guards.isDataArrayOwner(obj))
            throw new Error(`The result ${responseResult} isn't the orders type.`);

        return obj.data.map<Order>(orderObj => {
            if (!Guards.isDealOrder(orderObj))
                throw new Error(`The element (${orderObj}) of the orders object isn't the deal order type.`);
            if (!Guards.isOrderType(orderObj[1]))
                throw new Error(`The type of the order (${orderObj}) is incorrect. It should be 'SELL' or 'BUY' value.`);

            return {
                amount: orderObj[3],
                orderType: orderObj[1] === 'SELL' ? OrderType.Sell : OrderType.Buy,
                pair: currencyPair,
                price: orderObj[2]
            };
        })
    }

}