import { KuCoinListLanguages } from '../../src';

export const listLanguagesCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/language/list-languages(open)
    */
    default: {
        _comment: 'last boolean params determines if language is available',
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: [
            ['zh_CN', '中文', true],
            ['en_US', 'English', false]
        ]
    } as KuCoinListLanguages
};

export const wrongListLanguagesCases = {
    withoutLanguageCode: {
        _comment: 'last boolean params determines if language is available',
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530718094413,
        data: [
            ['zh_CN', '中文', true],
            [/* Missing required element */ 'English', false]
        ]
    } as KuCoinListLanguages
};
