export interface KuCoinCurrencyBalance {
    coinType: string;
    balance: number;
    freezeBalance: number;
}

export interface KuCoinOrderBook {
    SELL: KuCoinOrder[];
    BUY: KuCoinOrder[];
}

export interface KuCoinActiveOrders {
    SELL: KuCoinActiveOrder[];
    BUY: KuCoinActiveOrder[];
}

export type KuCoinOrder = [
    /*Price*/ number,
    /*Amount*/ number,
    /*Volume*/ number
];

export type KuCoinActiveOrder = [
    /*Timestamp*/ number,
    /*Order Type*/ KuCoinOrderType,
    /*Price*/ number,
    /*Amount*/ number,
    /*Deal Amount*/ number,
    /*OrderOid*/ string
];

export type KuCoinTrade = [
    /*Timestamp*/ number,
    /*Order Type*/ KuCoinOrderType,
    /*Price*/ number,
    /*Amount*/ number,
    /*Volume*/ number
];

export interface KuCoinCreatedOrder {
    orderOid: string;
}

export enum KuCoinOrderType {
    SELL = 'SELL',
    BUY = 'BUY'
}

export interface KuCoinOrderInfo {
    coinType: string;
    dealValueTotal: number;
    feeTotal: number;
    userOid: string;
    dealAmount: number;
    coinTypePair: string;
    type: KuCoinOrderType;
    orderOid: string;
    createdAt: number;
    dealOrders: {
        total: number;
        firstPage: boolean;
        lastPage: boolean;
        datas: Array<{
            amount: number;
            dealValue: number;
            fee: number;
            dealPrice: number;
            feeRate: number
        }>;
        currPageNo: number;
        limit: number;
        pageNos: number
    };
    dealPriceAverage: number;
    orderPrice: number;
    pendingAmount: number;
}
