import { isArray, isNumber, isString } from 'util';
import { Order, OrderType, CurrencyPair } from '../../core';

type orderResponseResult = [
    /*Timestamp*/ number,
    /*Order Type*/ string,
    /*Price*/ number,
    /*Amount*/ number,
    /*Volume*/ number
]

const Guards = {
    dataOwnerGuard: (dataOwner: any): dataOwner is { data: any[] } => dataOwner && dataOwner.data && isArray(dataOwner.data),
    orderGuard: (order: any): order is orderResponseResult =>
        order && isNumber(order[0]) && isString(order[1]) && isNumber(order[2]) && isNumber(order[3]) && isNumber(order[4]),
    orderTypeGuard: (orderType: string): orderType is 'SELL' | 'BUY' => orderType === 'SELL' || orderType === 'BUY'
};

export class KuCoinResponseParser {
    parseOrders(currencyPair: CurrencyPair, responseResult: string) {
        const obj = JSON.parse(responseResult);
        if (!Guards.dataOwnerGuard(obj))
            throw new Error(`The result ${responseResult} isn't the orders type.`);

        return obj.data.map<Order>(orderObj => {
            if (!Guards.orderGuard(orderObj))
                throw new Error(`The element (${orderObj}) of the orders object isn't the order type.`);
            if (!Guards.orderTypeGuard(orderObj[1]))
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