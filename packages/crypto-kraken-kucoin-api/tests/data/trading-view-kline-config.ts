import { KuCoinTradingViewKLineConfig } from '../../src';

export const tradingViewKLineConfigCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/public-market-data/get-kline-config(open,-tradingview-version)
    */
    default: {
        supports_marks: false,
        supports_time: true,
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: [
            '1',
            '5',
            '15',
            '30',
            '60',
            '480',
            'D',
            'W'
        ]
    } as KuCoinTradingViewKLineConfig
};

export const wrongTradingViewKLineConfigCases = {
    withoutSupportedResolutions: {
        supports_marks: false,
        supports_time: true,
        supports_search: true,
        supports_group_request: false
         /* There isn't the supported_resolutions field */
    } as KuCoinTradingViewKLineConfig,
    withWrongSupportedResolutionsFieldName: {
        'supports_marks': false,
        'supports_time': true,
        'supports_search': true,
        'supports_group_request': false,
        'supported-resolutions': [
            '1',
            '5',
            '15',
            '30',
            '60',
            '480',
            'D',
            'W'
        ]
    } as any as KuCoinTradingViewKLineConfig,
    withWrongSupportedResolutions: {
        supports_marks: false,
        supports_time: true,
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: [
            '1',
            '5',
            '15',
            '30',
            '60',
            1200000,
            '480',
            'D',
            'W'
        ]
    } as KuCoinTradingViewKLineConfig
};
