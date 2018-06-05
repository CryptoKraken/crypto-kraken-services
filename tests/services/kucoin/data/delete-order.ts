/* tslint:disable */
export const deleteOrderCases = {
    default: {
        data: {
            "success": true,
            "code": "OK",
            "data": null
        },
        expected: undefined
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
