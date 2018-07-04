import { KuCoinBuyOrderBook } from 'src';

export const buyOrderBooksCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/market/buy-order-books(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: [
            [18, 5, 90],
            [17, 5, 85]
        ]
    } as KuCoinBuyOrderBook
};

export const wrongBuyOrderBooksCases = {
    orderWithMissingPrice: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: [
            [/* Missing required element */ 5, 90],
            [17, 5, 85]
        ]
    } as KuCoinBuyOrderBook,
    orderWithMissingAmount: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: [
            [18, 5, 90],
            [17, /* Missing required element */ 85]
        ]
    } as KuCoinBuyOrderBook
};
