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
