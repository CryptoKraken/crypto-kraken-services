import { KuCoinErrorResponseResult } from 'src';

export const commonCases = {
    commonError: {
        success: false,
        code: 'ERROR',
        msg: 'This is a fake error for tests',
        timestamp: 1530718094413
    } as KuCoinErrorResponseResult
};

export const wrongCommonCases = {
    wrongResponse: {
        field1: 10,
        field2: 'field2'
    }
};
