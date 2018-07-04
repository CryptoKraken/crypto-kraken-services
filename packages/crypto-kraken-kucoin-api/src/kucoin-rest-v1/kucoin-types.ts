export enum KuCoinOrderType {
    SELL = 'SELL',
    BUY = 'BUY'
}

export interface KuCoinResponseResult {
    success: boolean;
    code: string;
    timestamp: number;
}

export interface KuCoinErrorResponseResult extends KuCoinResponseResult {
    success: false;
    code: string;
    msg: string;
}

export interface KuCoinSuccessResponseResult extends KuCoinResponseResult {
    success: true;
    code: 'OK';
    msg: string;
}

export interface KuCoinListExchangeRateOfCoins<K extends keyof any = string> extends KuCoinSuccessResponseResult {
    data: {
        currencies: Array<[
            /* Currency name */ string,
            /* Currency symbol */ string
        ]>,
        rates: {
            [P in K]: {
                [currencyName: string]: number
            }
        }
    };
}

export interface KuCoinListLanguages extends KuCoinSuccessResponseResult {
    _comment: string | undefined;
    data: Array<[
        /* Language code */ string,
        /* Language symbol */ string,
        /* Is language available */ boolean
    ]>;
}

interface CoinTick {
    coinType: string;
    trading: boolean;
    symbol: string;
    lastDealPrice: number;
    buy: number;
    sell: number;
    change: number;
    coinTypePair: string;
    sort: number;
    feeRate: number;
    volValue: number;
    high: number;
    datetime: number;
    vol: number;
    low: number;
    changeRate: number;
}
export interface KuCoinTick extends KuCoinSuccessResponseResult {
    data: CoinTick;
}

export interface KuCoinAllCoinsTick extends KuCoinSuccessResponseResult {
    data: CoinTick[];
}

export interface KuCoinOrderBook extends KuCoinSuccessResponseResult {
    data: {
        _comment: string | undefined;
        SELL: Array<[
            /* Price */ number,
            /* Amount */ number,
            /* Volume */ number
        ]>;
        BUY: Array<[
            /* Price */ number,
            /* Amount */ number,
            /* Volume */ number
        ]>;
    };
}

export interface KuCoinBuyOrderBook extends KuCoinSuccessResponseResult {
    data: Array<[
        /* Price */ number,
        /* Amount */ number,
        /* Volume */ number
    ]>;
}

export interface KuCoinSellOrderBook extends KuCoinSuccessResponseResult {
    data: Array<[
        /* Price */ number,
        /* Amount */ number,
        /* Volume */ number
    ]>;
}
