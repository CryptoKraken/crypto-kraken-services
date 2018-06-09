import { Order, OrderType } from '../../../../src/core';
import { Identified } from '../../../../src/utils';

/* tslint:disable */
export const createOrderCases = {
    default: {
        data: {
            "success": true,
            "code": "OK",
            "msg": "Operation succeeded.",
            "data": {
                "orderOid": "596186ad07015679730ffa02"
            }
        },
        expected: <Identified<Order>>{
            id: "596186ad07015679730ffa02",
            pair: ['AAA', 'BBB'],
            orderType: OrderType.Buy,
            price: 0.5,
            amount: 10
        }
    },
    dataAndAnyOtherField: {
        data: {
            success: true,
            code: 'OK',
            field1: 'otherData',
            data: {
                orderOid: "11c0fc0243351701298a5636"
            }
        },
        expected: <Identified<Order>>{
            id: "11c0fc0243351701298a5636",
            pair: ['AAA', 'CCC'],
            orderType: OrderType.Sell,
            price: 0.845,
            amount: 345
        }
    },
};

export const wrongCreateOrderCases = {
    dataWithoutOid: {
        success: true,
        code: 'OK',
        field1: 'otherData',
        data: {            
        }
    }
};
