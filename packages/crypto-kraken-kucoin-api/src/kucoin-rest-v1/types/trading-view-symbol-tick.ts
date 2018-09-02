import { FieldGuardsMap, isArray, isBoolean, isNumber, isString } from 'crypto-kraken-core';

export interface KuCoinTradingViewSymbolTick {
    ticker: string;
    minmov2: number;
    session: string;
    timezone: string;
    has_intraday: boolean;
    description: string;
    supported_resolutions: string[];
    type: string;
    currency_code: string;
    'exchange-listed': string;
    volume_precision: number;
    pointvalue: number;
    name: string;
    'exchange-traded': string;
    minmov: number;
    pricescale: number;
    has_no_volume: boolean;
}

export const kuCoinTradingViewSymbolTickGuardsMap: FieldGuardsMap<KuCoinTradingViewSymbolTick> = {
    'ticker': isString,
    'minmov2': isNumber,
    'session': isString,
    'timezone': isString,
    'has_intraday': isBoolean,
    'description': isString,
    'supported_resolutions': {
        this: isArray,
        every: isString,
    },
    'type': isString,
    'currency_code': isString,
    'exchange-listed': isString,
    'volume_precision': isNumber,
    'pointvalue': isNumber,
    'name': isString,
    'exchange-traded': isString,
    'minmov': isNumber,
    'pricescale': isNumber,
    'has_no_volume': isBoolean
};
