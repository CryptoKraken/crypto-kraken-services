export enum KuCoinOrderType {
    SELL = 'SELL',
    BUY = 'BUY'
}

export const isKuCoinOrderType = (data: any): data is KuCoinOrderType => {
    return data === KuCoinOrderType.SELL || data === KuCoinOrderType.BUY;
};
