import { KuCoinOrderBook } from 'src';

export const orderBookCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/market/order-books(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: {
            _comment: 'arr[0]   Price arr[1]   Amount arr[2]   Volume',
            timestamp: 1526450937000,
            SELL: [
                [20, 5, 100],
                [19, 5, 95]
            ],
            BUY: [
                [18, 5, 90],
                [17, 5, 85]
            ]
        }
    } as KuCoinOrderBook
};

export const wrongOrderBookCases = {
    sellOrderWithMissingPrice: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: {
            _comment: 'arr[0]   Price arr[1]   Amount arr[2]   Volume',
            timestamp: 1526450937000,
            SELL: [
                [/* Missing required element */ 5, 100],
                [19, 5, 95]
            ],
            BUY: [
                [18, 5, 90],
                [17, 5, 85]
            ]
        }
    } as KuCoinOrderBook,
    buyOrderWithMissingAmount: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: {
            _comment: 'arr[0]   Price arr[1]   Amount arr[2]   Volume',
            timestamp: 1526450937000,
            SELL: [
                [20, 5, 100],
                [19, 5, 95]
            ],
            BUY: [
                [18, 5, 90],
                [17, /* Missing required element */ 85]
            ]
        }
    } as KuCoinOrderBook,
    dataWithWrongOrderTypeName: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: {
            _comment: 'arr[0]   Price arr[1]   Amount arr[2]   Volume',
            timestamp: 1526450937000,
            SELL: [
                [20, 5, 100],
                [19, 5, 95]
            ],
            // The field name is wrong, it should be either 'SELL' or 'BUY'
            BUY1: [
                [18, 5, 90],
                [17, 5, 85]
            ]
        }
    } as any as KuCoinOrderBook
};
