export const commonCases = {
    error: {
        data: {
            success: false,
            code: 'ERROR',
            msg: 'Some error'
        }
    }
};

export const wrongCommonCases = {
    responseWithoutData: {
        success: true,
        code: 'OK',
        field1: 'otherData'
    }
};
