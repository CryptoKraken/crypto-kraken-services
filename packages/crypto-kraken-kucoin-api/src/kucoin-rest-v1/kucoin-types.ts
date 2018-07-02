export enum KuCoinOrderType {
    SELL = 'SELL',
    BUY = 'BUY'
}

export interface KuCoinResponseResult {
    success: boolean;
    code: string;
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

export interface KuCoinTick extends KuCoinSuccessResponseResult {
    data: {
        coinType: string;
        trading: boolean;
        lastDealPrice: number;
        buy: number;
        sell: number;
        coinTypePair: string;
        sort: number;
        feeRate: number;
        volValue: number;
        high: number;
        datetime: number;
        vol: number;
        low: number;
        changeRate: number;
    };
}

export interface KuCoinOrderBook extends KuCoinSuccessResponseResult {
    data: {
        _comment: string,
        timestamp: number,
        SELL: Array<[
            /*Price*/ number,
            /*Amount*/ number,
            /*Volume*/ number
        ]>;
        BUY: Array<[
            /*Price*/ number,
            /*Amount*/ number,
            /*Volume*/ number
        ]>;
    };
}
