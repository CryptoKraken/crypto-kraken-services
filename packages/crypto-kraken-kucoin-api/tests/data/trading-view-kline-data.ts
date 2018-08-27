import {
    tradingViewBarsArraysCases,
    tradingViewErrorCases,
    wrongTradingViewBarsArraysCases, wrongTradingViewErrorCases
} from 'crypto-kraken-core/tests/data';

export const tradingViewKLineDataCases = {
    ...tradingViewBarsArraysCases, ...{
        simpleError: tradingViewErrorCases.simple,
        errorWithoutMessage: tradingViewErrorCases.withoutErrorMessage
    }
};

export const wrongTradingViewKLineDataCases = {
    ...wrongTradingViewBarsArraysCases, ...{
        errorWithWrongStatus: wrongTradingViewErrorCases.withWrongStatus,
        errorWithUndefinedMessage: wrongTradingViewErrorCases.errorMessageUndefined
    }
};
