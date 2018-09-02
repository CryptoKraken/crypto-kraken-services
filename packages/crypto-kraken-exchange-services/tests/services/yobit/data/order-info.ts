import { OrderInfo, OrderType } from '../../../../src';

export const orderInfoCases = {
    orderInfo: {
        data: {
            success: 1,
            return: {
                100025362: {
                    pair: 'ltc_btc',
                    type: 'sell',
                    start_amount: 13.345,
                    amount: 12.345,
                    rate: 485,
                    timestamp_created: 1418654530,
                    status: 0
                }
            }
        },
        expect: {
            createdDate: new Date(1418654530),
            executedAmount: 1,
            remainingAmount: 12.345,
            order: {
                id: '100025362',
                amount: 13.345,
                orderType: OrderType.Sell,
                pair: ['ltc', 'btc'],
                price: 485
            }
        } as OrderInfo
    }
};

export const wrongOrderInfoCases = {
    dataWithoutReturnField: {
        success: 1,
        // there is not the 'return' field
    },
    dataWithoutAmountField: {
        success: 1,
        return: {
            100025362: {
                pair: 'ltc_btc',
                type: 'sell',
                start_amount: 13.345,
                // there is not the 'amount' field
                rate: 485,
                timestamp_created: 1418654530,
                status: 0
            }
        }
    }
};
