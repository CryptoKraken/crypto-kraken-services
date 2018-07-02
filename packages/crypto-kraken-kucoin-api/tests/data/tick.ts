import { KuCoinTick } from 'src';

export const tickCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/market/tick(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: {
            coinType: 'KCS',
            trading: true,
            lastDealPrice: 5040,
            buy: 5000,
            sell: 5040,
            coinTypePair: 'BTC',
            sort: 0,
            feeRate: 0.001,
            volValue: 308140577,
            high: 6890,
            datetime: 1506050394000,
            vol: 5028739175025,
            low: 5040,
            changeRate: -0.2642
        }
    } as KuCoinTick
};

export const wrongTickCases = {
    withoutCoinType: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: {
            /* There isn't the coinType field */
            trading: true,
            lastDealPrice: 5040,
            buy: 5000,
            sell: 5040,
            coinTypePair: 'BTC',
            sort: 0,
            feeRate: 0.001,
            volValue: 308140577,
            high: 6890,
            datetime: 1506050394000,
            vol: 5028739175025,
            low: 5040,
            changeRate: -0.2642
        }
    } as KuCoinTick,
    withoutDateTime: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        data: {
            coinType: 'KCS',
            trading: true,
            lastDealPrice: 5040,
            buy: 5000,
            sell: 5040,
            coinTypePair: 'BTC',
            sort: 0,
            feeRate: 0.001,
            volValue: 308140577,
            high: 6890,
            /* There isn't the datetime field */
            vol: 5028739175025,
            low: 5040,
            changeRate: -0.2642
        }
    } as KuCoinTick
};
