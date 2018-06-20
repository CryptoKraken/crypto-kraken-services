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
