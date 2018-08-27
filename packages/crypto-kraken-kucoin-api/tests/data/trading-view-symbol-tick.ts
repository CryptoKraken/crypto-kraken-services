import { TradingViewError } from 'crypto-kraken-core';
import { wrongTradingViewErrorCases } from '../../../crypto-kraken-core/tests/data';
import { KuCoinTradingViewSymbolTick } from '../../src';

export const tradingViewSymbolTickCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/public-market-data/get-symbol-tick(open,-tradingview-version)
    */
    default: {
        'ticker': 'KCS-BTC',
        'minmov': 1,
        'minmov2': 0,
        'session': '24x7',
        'timezone': 'Asia/Shanghai',
        'has_intraday': true,
        'description': 'KCS-BTC',
        'supported_resolutions': [
            '1',
            '5',
            '15',
            '30',
            '60',
            '480',
            'D',
            'W'
        ],
        'type': 'stock',
        'currency_code': 'BTC',
        'exchange-listed': '',
        'volume_precision': 8,
        'pointvalue': 1,
        'name': 'KCS-BTC',
        'exchange-traded': '',
        'pricescale': 100000000,
        'has_no_volume': true
    } as KuCoinTradingViewSymbolTick,
    ethAndBtc: {
        'ticker': 'ETH-BTC',
        'minmov2': 0,
        'session': '24x7',
        'timezone': 'Asia/Shanghai',
        'has_intraday': true,
        'description': 'ETH-BTC',
        'supported_resolutions': [
            '1',
            '5',
            '15',
            '30',
            '60',
            '480',
            'D',
            'W'
        ],
        'type': 'stock',
        'currency_code': 'BTC',
        'exchange-listed': '',
        'volume_precision': 8,
        'pointvalue': 1,
        'name': 'ETH-BTC',
        'exchange-traded': '',
        'minmov': 1,
        'pricescale': 100000000,
        'has_no_volume': true
    } as KuCoinTradingViewSymbolTick,
    unknownEmptySymbol: {
        s: 'error',
        errmsg: 'unknown_symbol '
    } as TradingViewError,
    unknownSymbolBtcAndEth: {
        s: 'error',
        errmsg: 'unknown_symbol BTC-ETH'
    } as TradingViewError
};

export const wrongTradingViewSymbolTickCases = {
    withoutName: {
        'ticker': 'ETH-BTC',
        'minmov2': 0,
        'session': '24x7',
        'timezone': 'Asia/Shanghai',
        'has_intraday': true,
        'description': 'ETH-BTC',
        'supported_resolutions': [
            '1',
            '5',
            '15',
            '30',
            '60',
            '480',
            'D',
            'W'
        ],
        'type': 'stock',
        'currency_code': 'BTC',
        'exchange-listed': '',
        'volume_precision': 8,
        'pointvalue': 1,
        /* There isn't the name field */
        'exchange-traded': '',
        'minmov': 1,
        'pricescale': 100000000,
        'has_no_volume': true
    } as KuCoinTradingViewSymbolTick,
    withWrongPriceScale: {
        'ticker': 'KCS-BTC',
        'minmov': 1,
        'minmov2': 0,
        'session': '24x7',
        'timezone': 'Asia/Shanghai',
        'has_intraday': true,
        'description': 'KCS-BTC',
        'supported_resolutions': [
            '1',
            '5',
            '15',
            '30',
            '60',
            '480',
            'D',
            'W'
        ],
        'type': 'stock',
        'currency_code': 'BTC',
        'exchange-listed': '',
        'volume_precision': 8,
        'pointvalue': 1,
        'name': 'KCS-BTC',
        'exchange-traded': '',
        'pricescale': 'wrong',
        'has_no_volume': true
    } as any as KuCoinTradingViewSymbolTick,
    withWrongTradingViewError: wrongTradingViewErrorCases.withWrongStatus
};
