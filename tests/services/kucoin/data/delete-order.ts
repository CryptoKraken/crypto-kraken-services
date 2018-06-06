/* tslint:disable */
export const deleteOrderCases = {
    default: {
        data: {
            "success": true,
            "code": "OK",
            "data": null
        },
        expected: undefined
    },
    error: {
        data: {
            success: false,
            code: 'ERROR',
            msg: 'Some error'
        }
    }
};

export const wrongDeleteOrderCases = {
    dataWithBody: {
        field1: 'otherData',
        data: {
            field1: 'someExcessData'
        }
    }
};
