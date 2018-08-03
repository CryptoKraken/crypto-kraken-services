export type OrderBookOrder = [
    /* Price */ number,
    /* Amount */ number,
    /* Volume */ number
];

export const kuCoinCommentGuard = (value: any): value is string | undefined => {
    return value === undefined || typeof value === 'string';
};

export const orderBookOrderGuard = (value: any): value is [number, number, number] => {
    return typeof value[0] === 'number' && typeof value[1] === 'number' && typeof value[2] === 'number';
};
