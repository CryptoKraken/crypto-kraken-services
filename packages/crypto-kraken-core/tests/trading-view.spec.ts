import { expect } from 'chai';
import {
    is,
    TradingViewBarsArrays, TradingViewBarsArraysError,
    tradingViewBarsArraysErrorGuardsMap, tradingViewBarsArraysGuardsMap
} from '../src';
import {
    tradingViewBarsArraysCases, tradingViewBarsArraysErrorCases,
    wrongTradingViewBarsArraysCases, wrongTradingViewBarsArraysErrorCases
} from './data';

describe('The types and guards of trading view', () => {
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

    describe('The guard of the TradingViewBarsArraysError type', () => {
        it(`should return a 'true' result in the case of correct input data`, () => {
            expect(is<TradingViewBarsArraysError>(
                tradingViewBarsArraysErrorCases.simple, tradingViewBarsArraysErrorGuardsMap
            )).to.be.true;
            expect(is<TradingViewBarsArraysError>(
                tradingViewBarsArraysErrorCases.withoutErrorMessage, tradingViewBarsArraysErrorGuardsMap
            )).to.be.true;
        });

        it(`should return a 'false' result in the case of wrong input data`, () => {
            expect(is<TradingViewBarsArraysError>(
                wrongTradingViewBarsArraysErrorCases.otherObject, tradingViewBarsArraysErrorGuardsMap
            )).to.be.false;
            expect(is<TradingViewBarsArraysError>(
                wrongTradingViewBarsArraysErrorCases.withWrongStatus, tradingViewBarsArraysErrorGuardsMap
            )).to.be.false;
            expect(is<TradingViewBarsArraysError>(
                wrongTradingViewBarsArraysErrorCases.errorMessageUndefined, tradingViewBarsArraysErrorGuardsMap
            )).to.be.false;
        });
    });
});
