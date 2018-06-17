import { isArray, isBoolean, isNumber, isString } from 'util';
import { CurrencyBalance, CurrencyPair, Order, OrderBook, OrderInfo, OrderType } from '../../core';
import { Identified } from '../../utils';
import {
    KuCoinActiveOrder, KuCoinActiveOrders, KuCoinCreatedOrder,
    KuCoinCurrencyBalance, KuCoinOrder, KuCoinOrderBook, KuCoinOrderInfo, KuCoinOrderType, KuCoinTrade
} from './kucoin-types';
import { KuCoinUtils } from './kucoin-utils';

type FieldGuardsMap<T> = {
    [P in keyof T]: (value: any) => boolean;
};

type KuCoinGuard<Type> = <Selector extends Array<keyof Type> | undefined = undefined>(
    data: any, fields?: Selector
) => data is Selector extends undefined ? Type :
Pick<Type, (Selector extends Array<infer T> ? T : keyof Type)>
& { [P in keyof Type]?: P extends (Selector extends Array<infer U> ? U : keyof Type) ? Type[P] : any };

interface KuCoinResponseResult {
    success: boolean;
    code: string;
    [nameField: string]: any;
}

interface KuCoinSuccessResponseResult extends KuCoinResponseResult {
    success: true;
    code: 'OK';
}

const Guards = {
    isKuCoinResponseResult: (data: any): data is KuCoinResponseResult => {
        return data && isBoolean(data.success) && isString(data.code);
    },

    isKuCoinSuccessResponseResult: (data: KuCoinResponseResult): data is KuCoinSuccessResponseResult => {
        return data && data.success && data.code === 'OK';
    },

    isDataObjOwner: (data: any): data is { data: any } => data && data.data,

    isDataArrayOwner: (data: any): data is { data: any[] } => {
        return Guards.isDataObjOwner(data) && isArray(data.data);
    },

    isKuCoinOrderBook: (data: any): data is KuCoinOrderBook => {
        return data && data.SELL && data.BUY
            && isArray(data.SELL) && isArray(data.BUY)
            && data.SELL.every((order: any) => Guards.isKuCoinOrder(order))
            && data.BUY.every((order: any) => Guards.isKuCoinOrder(order));
    },

    isKuCoinActiveOrders: (data: any): data is KuCoinActiveOrders => {
        return data && data.SELL && data.BUY
            && isArray(data.SELL) && isArray(data.BUY)
            && data.SELL.every((activeOrder: any) => Guards.isKuCoinActiveOrder(activeOrder))
            && data.BUY.every((activeOrder: any) => Guards.isKuCoinActiveOrder(activeOrder));
    },

    isKuCoinOrder: (data: any): data is KuCoinOrder => {
        return data && isNumber(data[0]) && isNumber(data[1]) && isNumber(data[2]);
    },

    isKuCoinActiveOrder: (data: any): data is KuCoinActiveOrder => {
        return data && isNumber(data[0]) && Guards.isKuCoinOrderType(data[1])
            && isNumber(data[2]) && isNumber(data[3])
            && isNumber(data[4]) && isString(data[5]);
    },

    isKuCoinTrade: (data: any): data is KuCoinTrade => {
        return data && isNumber(data[0]) && isString(data[1]) && Guards.isKuCoinOrderType(data[1])
            && isNumber(data[2]) && isNumber(data[3]) && isNumber(data[4]);
    },

    isKuCoinCreatedOrder: (data: any): data is KuCoinCreatedOrder => data && isString(data.orderOid),

    isKuCoinOrderType: (data: any): data is KuCoinOrderType => {
        return data === KuCoinOrderType.SELL || data === KuCoinOrderType.BUY;
    },

    isKuCoinCurrencyBalance: (data: any): data is KuCoinCurrencyBalance => {
        return data && isString(data.coinType) && isNumber(data.balance) && isNumber(data.freezeBalance);
    },

    isKuCoinOrderInfo: ((data, fields?) => {
        // TODO: move this map to a property of the KuCoinGuard class/type
        const kuCoinOrderInfoFieldsMap: FieldGuardsMap<KuCoinOrderInfo> = {
            coinType: isString,
            dealValueTotal: isNumber,
            feeTotal: isNumber,
            userOid: isString,
            dealAmount: isNumber,
            coinTypePair: isString,
            type: Guards.isKuCoinOrderType,
            orderOid: isString,
            createdAt: isNumber,
            dealPriceAverage: isNumber,
            orderPrice: isNumber,
            pendingAmount: isNumber,
            dealOrders: value => {
                return value && isNumber(value.total) && isBoolean(value.firstPage) && isBoolean(value.lastPage)
                    && isNumber(value.currPageNo) && isNumber(value.limit) && isNumber(value.pageNos)
                    && isArray(value.datas) && (value.datas.length === 0 || value.datas.every((dealOrder: any) => {
                        return isNumber(dealOrder.amount) && isNumber(dealOrder.dealValue) && isNumber(dealOrder.fee)
                            && isNumber(dealOrder.dealPrice) && isNumber(dealOrder.feeRate);
                    }));
            }
        };

        const fieldNames = (fields ||
            (Object.getOwnPropertyNames(kuCoinOrderInfoFieldsMap) as Array<keyof KuCoinOrderInfo>)
        );
        return fieldNames.every(field => kuCoinOrderInfoFieldsMap[field](data[field]));

    }) as KuCoinGuard<KuCoinOrderInfo>
};

export class KuCoinResponseParser {
    parseOrderBook(responseResult: string, currencyPair: CurrencyPair): OrderBook {
        const obj = JSON.parse(responseResult);
        if (!Guards.isDataObjOwner(obj) || !Guards.isKuCoinOrderBook(obj.data))
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

    parseCurrencyBalance(responseResult: string, currency: string): CurrencyBalance {
        const obj = JSON.parse(responseResult);
        if (!Guards.isDataObjOwner(obj) || !Guards.isKuCoinCurrencyBalance(obj.data))
            throw new Error(`The result ${responseResult} isn't the currency balance type.`);
        const kucoinCurrencyBalance = obj.data;
        if (kucoinCurrencyBalance.coinType !== currency)
            throw new Error('The requested coin type does not correspond the coin type of the response.');
        return {
            allAmount: kucoinCurrencyBalance.balance,
            lockedAmount: kucoinCurrencyBalance.freezeBalance,
            freeAmount: kucoinCurrencyBalance.balance - kucoinCurrencyBalance.freezeBalance
        };
    }

    parseTrades(responseResult: string, currencyPair: CurrencyPair): Order[] {
        const obj = JSON.parse(responseResult);
        if (!Guards.isDataArrayOwner(obj))
            throw new Error(`The result ${responseResult} isn't the orders type.`);

        return obj.data.map<Order>(orderObj => {
            if (!Guards.isKuCoinTrade(orderObj))
                throw new Error(`The element (${orderObj}) of the orders object isn't the trade type.`);

            return {
                amount: orderObj[3],
                orderType: KuCoinUtils.getOrderType(orderObj[1]),
                pair: currencyPair,
                price: orderObj[2]
            };
        });
    }

    parseCreatedOrder(responseResult: string, order: Order): Identified<Order> {
        const obj = JSON.parse(responseResult);
        if (!Guards.isDataObjOwner(obj) || !Guards.isKuCoinCreatedOrder(obj.data))
            throw new Error(`The result ${responseResult} isn't the order type.`);

        return {
            id: obj.data.orderOid,
            ...order
        };
    }

    parseDeletedOrder(responseResult: string): void {
        this.parseResponseResult(responseResult);
    }

    parseActiveOrders(responseResult: string, currencyPair: CurrencyPair): Array<Identified<Order>> {
        const response = this.parseResponseDataObj(responseResult);
        if (!Guards.isKuCoinActiveOrders(response.data))
            throw new Error(`The result '${responseResult}' doesn't contain active orders`);

        return response.data.SELL
            .map<Identified<Order>>(kuCoinActiveOrder => ({
                id: kuCoinActiveOrder[5],
                amount: kuCoinActiveOrder[3],
                orderType: OrderType.Sell,
                pair: currencyPair,
                price: kuCoinActiveOrder[2]
            }))
            .concat(response.data.BUY
                .map<Identified<Order>>(kuCoinActiveOrder => ({
                    id: kuCoinActiveOrder[5],
                    amount: kuCoinActiveOrder[3],
                    orderType: OrderType.Buy,
                    pair: currencyPair,
                    price: kuCoinActiveOrder[2]
                }))
            );
    }

    parseOrderInfo(responseResult: string): OrderInfo {
        const response = this.parseResponseDataObj(responseResult);
        if (!Guards.isKuCoinOrderInfo(response.data,
            [
                'coinType', 'coinTypePair', 'type', 'createdAt',
                'orderOid', 'dealOrders', 'orderPrice', 'pendingAmount'
            ]
        ))
            throw new Error(`The result '${responseResult}' doesn't contain an order info`);

        const orderInfo = response.data;
        return {
            order: {
                id: orderInfo.orderOid,
                pair: { 0: orderInfo.coinType, 1: orderInfo.coinTypePair },
                orderType: KuCoinUtils.getOrderType(orderInfo.type),
                amount: orderInfo.pendingAmount + orderInfo.dealOrders.total,
                price: orderInfo.orderPrice
            },
            currentAmount: orderInfo.pendingAmount,
            remainingAmount: orderInfo.dealOrders.total,
            createdDate: new Date(orderInfo.createdAt)
        };
    }

    protected parseResponseDataObj(responseResult: string): KuCoinSuccessResponseResult & { data: any } {
        const response = this.parseResponseResult(responseResult);
        if (!Guards.isDataObjOwner(response))
            throw new Error(`The response result '${responseResult}' hasn't got the 'data' field`);
        return response;
    }

    protected parseResponseDataArray(responseResult: string): KuCoinSuccessResponseResult & { data: any[] } {
        const response = this.parseResponseResult(responseResult);
        if (!Guards.isDataArrayOwner(response))
            throw new Error(`The response result '${responseResult}' hasn't got the 'data' field`);
        return response;
    }

    protected parseResponseResult(responseResult: string): KuCoinSuccessResponseResult {
        const obj = JSON.parse(responseResult);
        if (!Guards.isKuCoinResponseResult(obj))
            throw new Error(`The result ${responseResult} isn't a KuCoin response result.`);
        if (!Guards.isKuCoinSuccessResponseResult(obj))
            throw new Error(obj.msg);
        return obj;
    }
}
