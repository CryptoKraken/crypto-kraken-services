import { TradingViewBarsArrays } from '../../src/index';

export const tradingViewBarsArraysCases = {
    simple: {
        s: 'ok',
        o: [0.01, 0.01],
        c: [0.01, 0.02],
        t: [1505584800, 1505588400],
        v: [100, 300],
        h: [0.03, 0.04],
        l: [0.01, 0.01]
    } as TradingViewBarsArrays,
    withNullValues: {
        s: 'ok',
        o: [0.01, null, 0.01],
        c: [0.01, null, 0.02],
        t: [1505584800, 1505586600, 1505588400],
        v: [100, 0, 300],
        h: [0.03, null, 0.04],
        l: [0.01, null, 0.01]
    } as TradingViewBarsArrays,
    noData: {
        s: 'no_data',
        o: [],
        c: [],
        t: [],
        v: [],
        h: [],
        l: [],
    } as TradingViewBarsArrays,
    noDataWithNextBar: {
        s: 'no_data',
        o: [],
        c: [],
        t: [],
        v: [],
        h: [],
        l: [],
        nb: 1505588400
    } as TradingViewBarsArrays
};

export const wrongTradingViewBarsArraysCases = {
    otherObject: {
        anyField: 'value'
    } as any as TradingViewBarsArrays,
    withWrongStatus: {
        s: 'ok1',
        o: [0.01, 0.01],
        c: [0.01, 0.02],
        t: [1505584800, 1505588400],
        v: [100, 300],
        h: [0.03, 0.04],
        l: [0.01, 0.01]
    } as any as TradingViewBarsArrays,
    withUndefinedInsideValuesArray: {
        s: 'ok',
        o: [0.01, null, 0.01],
        c: [0.01, undefined, 0.02],
        t: [1505584800, 1505586600, 1505588400],
        v: [100, 0, 300],
        h: [0.03, null, 0.04],
        l: [0.01, null, 0.01]
    } as any as TradingViewBarsArrays
};

export const tradingViewBarsArraysErrorCases = {
    simple: {
        s: 'error',
        errmsg: 'Some error'
    },
    withoutErrorMessage: {
        s: 'error'
    }
};

export const wrongTradingViewBarsArraysErrorCases = {
    otherObject: {
        anyField: 'value'
    },
    withWrongStatus: {
        s: 'ok',
        errmsg: 'Some error'
    },
    errorMessageUndefined: {
        s: 'error',
        errmsg: null
    }
};
