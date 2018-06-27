export const deleteOrderCases = {
    defaultWithId100025362: {
        data: {
            success: 1,
            return: {
                order_id: 100025362,
                funds: {
                    btc: 15,
                    ltc: 51.82,
                    nvc: 0,
                }
            }
        }
    }
};

export const wrongDeleteOrderCases = {
    dataWithoutOrderIdField: {
        success: 1,
        return: {
            // there is not the 'order_id' property
            funds: {
                btc: 15,
                ltc: 51.82,
                nvc: 0,
            }
        }
    }
};
