import { FieldGuardsMap, isBoolean, isNumber, isString } from 'crypto-kraken-core';

export type OrderBookOrder = [
    /* Price */ number,
    /* Amount */ number,
    /* Volume */ number
];

export interface CoinInfo {
    coin: string;
    enable: boolean;
    orgAddress: string | null;
    userAddressName: string | null;
    coinType: string | null;
    confirmationCount: number;
    depositRemark: string | null;
    enableDeposit: boolean;
    enableWithdraw: boolean;
    infoUrl: string | null;
    name: string;
    tradePrecision: number;
    txUrl: string | null;
    withdrawFeeRate: number;
    withdrawMinAmount: number;
    withdrawMinFee: number;
    withdrawRemark: string | null;
}

export const isNullOrNumber = (value: any): value is number | null => {
    return value === null || typeof value === 'number';
};

export const isNullOrString = (value: any): value is string | null => {
    return value === null || typeof value === 'string';
};

export const kuCoinCommentGuard = (value: any): value is string | undefined => {
    return value === undefined || typeof value === 'string';
};

export const orderBookOrderGuard = (value: any): value is [number, number, number] => {
    return typeof value[0] === 'number' && typeof value[1] === 'number' && typeof value[2] === 'number';
};

export const coinInfoGuardsMap: FieldGuardsMap<CoinInfo> = {
    coin: isString,
    enable: isBoolean,
    orgAddress: isNullOrString,
    userAddressName: isNullOrString,
    coinType: isNullOrString,
    confirmationCount: isNumber,
    depositRemark: isNullOrString,
    enableDeposit: isBoolean,
    enableWithdraw: isBoolean,
    infoUrl: isNullOrString,
    name: isString,
    tradePrecision: isNumber,
    txUrl: isNullOrString,
    withdrawFeeRate: isNumber,
    withdrawMinAmount: isNumber,
    withdrawMinFee: isNumber,
    withdrawRemark: isNullOrString
};
