import {
    tradingViewBarsArraysCases,
    tradingViewBarsArraysErrorCases,
    wrongTradingViewBarsArraysCases, wrongTradingViewBarsArraysErrorCases
} from 'crypto-kraken-core/tests/data';

export const tradingViewKLineDataCases = {
    ...tradingViewBarsArraysCases, ...{
        simpleError: tradingViewBarsArraysErrorCases.simple,
        errorWithoutMessage: tradingViewBarsArraysErrorCases.withoutErrorMessage
    }
};

export const wrongTradingViewKLineDataCases = {
    ...wrongTradingViewBarsArraysCases, ...{
        errorWithWrongStatus: wrongTradingViewBarsArraysErrorCases.withWrongStatus,
        errorWithUndefinedMessage: wrongTradingViewBarsArraysErrorCases.errorMessageUndefined
    }
};
