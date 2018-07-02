import { KuCoinSellOrderBook } from 'src';

export const sellOrderBooksCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/market/sell-order-books(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: [
            [18, 5, 90],
            [17, 5, 85]
        ]
    } as KuCoinSellOrderBook
};

export const wrongSellOrderBooksCases = {
    orderWithMissingPrice: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: [
            [/* Missing required element */ 5, 90],
            [17, 5, 85]
        ]
    } as KuCoinSellOrderBook,
    orderWithMissingAmount: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: [
            [18, 5, 90],
            [17, /* Missing required element */ 85]
        ]
    } as KuCoinSellOrderBook
};
