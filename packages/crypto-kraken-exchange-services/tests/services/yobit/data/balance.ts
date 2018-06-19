/* tslint:disable */
import { CurrencyBalance } from '../../../../src/core';

export const balanceCases = {
    defaultLtcBalance: {
        data: {
            success: 1,
            return: {
                funds: {
                    ltc: 22.5,
                    nvc: 423.998,
                    ppc: 10,
                },
                funds_incl_orders: {
                    ltc: 32,
                    nvc: 523.998,
                    ppc: 20,
                }
            }
        },
        expect: <CurrencyBalance>{
            allAmount: 32,
            freeAmount: 22.5,
            lockedAmount: 9.5
        }
    },
    zeroLtcBalance: {
        data: {
            success: 1,
            return: {
                funds: {
                    ltc: 0,
                    nvc: 423.998,
                    ppc: 10,
                },
                funds_incl_orders: {
                    ltc: 0,
                    nvc: 523.998,
                    ppc: 20,
                }
            }
        },
        expect: <CurrencyBalance>{
            allAmount: 0,
            freeAmount: 0,
            lockedAmount: 0
        }
    },
    allLockedLtcBalance: {
        data: {
            success: 1,
            return: {
                funds: {
                    ltc: 0,
                    nvc: 423.998,
                    ppc: 10,
                },
                funds_incl_orders: {
                    ltc: 12.2,
                    nvc: 523.998,
                    ppc: 20,
                }
            }
        },
        expect: <CurrencyBalance>{
            allAmount: 12.2,
            freeAmount: 0,
            lockedAmount: 12.2
        }
    }
}

export const wrongBalanceCases = {
    dataWithoutReturnField: {
        success: 1,
        // there is not the 'return' property
        result: 'data'
    },
    dataWithoutFundField: {
        success: 1,
        return: {
            // there is not the 'funds' property
            funds_incl_orders: {
                ltc: 12.2,
                nvc: 523.998,
                ppc: 20,
            }
        }
    },
    dataWithoutFoundInclOrdersField: {
        success: 1,
        return: {
            // there is not the 'funds_incl_orders' property
            funds: {
                ltc: 12.2,
                nvc: 523.998,
                ppc: 20,
            }
        }
    },
    dataWithoutCurrencyInfoInFunds: {
        success: 1,
        return: {
            funds: {
                // there is not the 'ltc' property
                nvc: 423.998,
                ppc: 10,
            },
            funds_incl_orders: {
                ltc: 12.2,
                nvc: 523.998,
                ppc: 20,
            }
        }
    },
    dataWithoutCurrencyInfoInFundsInclOrders: {
        success: 1,
        return: {
            funds: {
                ltc: 12.2,
                nvc: 423.998,
                ppc: 10,
            },
            funds_incl_orders: {
                // there is not the 'ltc' property
                nvc: 523.998,
                ppc: 20,
            }
        }
    }
}
