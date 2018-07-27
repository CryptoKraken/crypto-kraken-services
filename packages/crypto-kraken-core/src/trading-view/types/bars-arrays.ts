import { FieldGuardsMap, isArray, isNullOrNumber, isNumber } from '../../guards';

/**
 * See the 'history' method of TradingView REST Api by this link: https://www.tradingview.com/rest-api-spec/
 */
export interface BarsArrays {
    /**
     * Close price.
     */
    c: Array<number | null>;
    /**
     * High price.
     */
    h: Array<number | null>;
    /**
     * Low price.
     */
    l: Array<number | null>;
    /**
     * Open price.
     */
    o: Array<number | null>;
    /**
     * Status code.
     */
    s: 'ok' | 'no_data';
    /**
     * Bar Unix timestamp. Daily bars should only have the date part, time should be 0.
     */
    t: number[];
    /**
     * Next bar Unix timestamp.
     */
    nb?: number;
    /**
     * Volume
     */
    v: number[];
}

/**
 * See the 'history' method of TradingView REST Api by this link: https://www.tradingview.com/rest-api-spec/
 */
export interface BarsArraysError {
    /**
     * Status code.
     */
    s: 'error';
    /**
     * Error message.
     */
    errmsg?: string;
}

export const tradingViewBarsArraysGuardsMap: FieldGuardsMap<BarsArrays> = {
    c: {
        this: isArray,
        every: isNullOrNumber
    },
    h: {
        this: isArray,
        every: isNullOrNumber
    },
    l: {
        this: isArray,
        every: isNullOrNumber
    },
    o: {
        this: isArray,
        every: isNullOrNumber
    },
    s: (value: any): value is BarsArrays['s'] => value === 'ok' || value === 'no_data',
    t: {
        this: isArray,
        every: isNumber
    },
    nb: (value: any): value is number | undefined => value === undefined || typeof value === 'number',
    v: {
        this: isArray,
        every: isNumber
    },
};

export const tradingViewBarsArraysErrorGuardsMap: FieldGuardsMap<BarsArraysError> = {
    s: (value: any): value is BarsArraysError['s'] => value === 'error',
    errmsg: (value: any): value is string | undefined => value === undefined || typeof value === 'string'
};
