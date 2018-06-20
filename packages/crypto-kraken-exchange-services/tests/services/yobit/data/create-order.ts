import { Identified, Order, OrderType } from '../../../../src';

export const createOrderCases = {
    defaultSellLtcBtcWithPrice100Order: {
        data: {
            success: 1,
            return: {
                received: 0,
                remains: 12,
                order_id: 12345,
                funds: {
                    btc: 15,
                    ltc: 51.82,
                    nvc: 0
                }
            }
        },
        expect: {
            id: '12345',
            amount: 12,
            orderType: OrderType.Sell,
            pair: ['ltc', 'btc'],
            price: 100
        } as Identified<Order>
    }
};
export const wrongCreateOrderCases = {
    dataWithoutReturnField: {
        success: 1,
        // there is not the 'return' property
        result: 'data'
    },
    dataWithoutOrderIdField: {
        success: 1,
        return: {
            received: 0,
            remains: 12,
            // there is not the 'order_id' property
            funds: {
                btc: 15,
                ltc: 51.82,
                nvc: 0
            }
        }
    }
};
