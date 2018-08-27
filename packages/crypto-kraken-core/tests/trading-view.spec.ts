import { expect } from 'chai';
import {
    is,
    TradingViewBarsArrays, tradingViewBarsArraysGuardsMap,
    TradingViewError, tradingViewErrorGuardsMap
} from '../src';
import {
    tradingViewBarsArraysCases, tradingViewErrorCases,
    wrongTradingViewBarsArraysCases, wrongTradingViewErrorCases
} from './data';

describe('The types and guards of trading view', () => {
    describe('The guard of the TradingViewError type', () => {
        it(`should return a 'true' result in the case of correct input data`, () => {
            expect(is<TradingViewError>(
                tradingViewErrorCases.simple, tradingViewErrorGuardsMap
            )).to.be.true;
            expect(is<TradingViewError>(
                tradingViewErrorCases.withoutErrorMessage, tradingViewErrorGuardsMap
            )).to.be.true;
        });

        it(`should return a 'false' result in the case of wrong input data`, () => {
            expect(is<TradingViewError>(
                wrongTradingViewErrorCases.otherObject, tradingViewErrorGuardsMap
            )).to.be.false;
            expect(is<TradingViewError>(
                wrongTradingViewErrorCases.withWrongStatus, tradingViewErrorGuardsMap
            )).to.be.false;
            expect(is<TradingViewError>(
                wrongTradingViewErrorCases.errorMessageUndefined, tradingViewErrorGuardsMap
            )).to.be.false;
        });
    });

    describe('The guard of the TradingViewBarsArrays type', () => {
        it(`should return a 'true' result in the case of correct input data`, () => {
            expect(is<TradingViewBarsArrays>(
                tradingViewBarsArraysCases.simple, tradingViewBarsArraysGuardsMap
            )).to.be.true;
            expect(is<TradingViewBarsArrays>(
                tradingViewBarsArraysCases.withNullValues, tradingViewBarsArraysGuardsMap
            )).to.be.true;
            expect(is<TradingViewBarsArrays>(
                tradingViewBarsArraysCases.noData, tradingViewBarsArraysGuardsMap
            )).to.be.true;
            expect(is<TradingViewBarsArrays>(
                tradingViewBarsArraysCases.noDataWithNextBar, tradingViewBarsArraysGuardsMap
            )).to.be.true;
        });

        it(`should return a 'false' result in the case of wrong input data`, () => {
            expect(is<TradingViewBarsArrays>(
                wrongTradingViewBarsArraysCases.otherObject, tradingViewBarsArraysGuardsMap
            )).to.be.false;
            expect(is<TradingViewBarsArrays>(
                wrongTradingViewBarsArraysCases.withUndefinedInsideValuesArray, tradingViewBarsArraysGuardsMap
            )).to.be.false;
            expect(is<TradingViewBarsArrays>(
                wrongTradingViewBarsArraysCases.withWrongStatus, tradingViewBarsArraysGuardsMap
            )).to.be.false;
        });
    });
});
