import { KuCoinAllCoinsTick, KuCoinTick } from '../../src';

export const tickCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/market/tick(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: {
            coinType: 'KCS',
            trading: true,
            symbol: 'KCS-BTC',
            lastDealPrice: 5040,
            buy: 5000,
            sell: 5040,
            change: 0.00000451,
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
    withZeroVolume: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1535815518353,
        data: {
            coinType: 'ARN',
            trading: true,
            symbol: 'ARN-BTC',
            st: true,
            lastDealPrice: 0.000046,
            buy: 0.00004105,
            sell: 0.00005098,
            change: 0,
            coinTypePair: 'BTC',
            sort: 100,
            feeRate: 0.001,
            volValue: 0,
            datetime: 1535805834000,
            vol: 0,
            changeRate: 0
        }
    } as KuCoinTick,
    btgUsdt: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1535807431695,
        data: {
            coinType: 'BTG',
            trading: true,
            symbol: 'BTG-USDT',
            lastDealPrice: null,
            buy: 15.834911,
            sell: 300.999977,
            change: null,
            coinTypePair: 'USDT',
            sort: 100,
            feeRate: 0.001,
            volValue: 0,
            high: null,
            datetime: 1535807430000,
            vol: 0,
            low: null,
            changeRate: null
        }
    } as KuCoinTick,
    allCoins: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530700477681,
        data: [
            {
                coinType: 'BTC',
                trading: true,
                symbol: 'BTC-USDT',
                lastDealPrice: 6520,
                buy: 6519.223347,
                sell: 6520,
                change: 20.322961,
                coinTypePair: 'USDT',
                sort: 100,
                feeRate: 0.001,
                volValue: 928631.12166411,
                high: 6640,
                datetime: 1530700460000,
                vol: 142.25203491,
                low: 6414.057852,
                changeRate: 0.0031
            },
            {
                coinType: 'ETH',
                trading: true,
                symbol: 'ETH-BTC',
                lastDealPrice: 0.071465,
                buy: 0.07139701,
                sell: 0.07146498,
                change: 0.00049035,
                coinTypePair: 'BTC',
                sort: 100,
                feeRate: 0.001,
                volValue: 215.52222444,
                high: 0.07194733,
                datetime: 1530700460000,
                vol: 3028.6813762,
                low: 0.07042248,
                changeRate: 0.0069
            },
            {
                coinType: 'ETH',
                trading: true,
                symbol: 'ETH-USDT',
                lastDealPrice: 465.693786,
                buy: 465.693786,
                sell: 466.62641,
                change: 4.273506,
                coinTypePair: 'USDT',
                sort: 100,
                feeRate: 0.001,
                volValue: 774595.83296871,
                high: 473.5,
                datetime: 1530700460000,
                vol: 1673.2747152,
                low: 452.101077,
                changeRate: 0.0093
            }
        ]
    } as KuCoinAllCoinsTick
};

export const wrongTickCases = {
    allCoinsWithDataObj: tickCases.default,
    withoutCoinType: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: {
            /* There isn't the coinType field */
            trading: true,
            symbol: 'KCS-BTC',
            lastDealPrice: 5040,
            buy: 5000,
            sell: 5040,
            change: 0.00000451,
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
        timestamp: 1530718094413,
        data: {
            coinType: 'KCS',
            trading: true,
            symbol: 'KCS-BTC',
            lastDealPrice: 5040,
            buy: 5000,
            sell: 5040,
            change: 0.00000451,
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
