export enum KuCoinOrderType {
    SELL = 'SELL',
    BUY = 'BUY'
}

export interface KuCoinResponseResult {
    success: boolean;
    code: string;
    [nameField: string]: any;
}

export interface KuCoinSuccessResponseResult extends KuCoinResponseResult {
    success: true;
    code: 'OK';
    msg: string;
}

export interface KuCoinOrderBook extends KuCoinSuccessResponseResult {
    data: {
        '_comment': 'arr[0]   Price arr[1]   Amount arr[2]   Volume',
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
