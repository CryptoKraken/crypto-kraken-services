import { CurrencyBalance } from '../../../../src/core/currency-balance';

/* tslint:disable */
export const currencyBalancesCases = {
    /** This case is from the KuCoin documentation: https://kucoinapidocs.docs.apiary.io/#reference/0/user/get-balance-of-coin */
    default: {
        data: {
            "success": true,
            "code": "OK",
            "data": {
                coinType: "BTC",
                balance: 1233214,
                freezeBalance: 321321
            }
        },
        expected: <CurrencyBalance>{
            allAmount: 1233214,
            freeAmount: 911893,
            lockedAmount: 321321
        }
    },
    dataAndAnyOtherField: {
        data: {
            field1: 'otherData',
            data: {
                coinType: 'AAA',
                balance: 500,
                freezeBalance: 200
            }
        },
        expected: <CurrencyBalance>{
            allAmount: 500,
            freeAmount: 300,
            lockedAmount: 200
        }
    },
    zeroBalance: {
        data: {
            field1: 'otherData',
            data: {
                coinType: 'BBB',
                balance: 0,
                freezeBalance: 0
            }
        },
        expected: <CurrencyBalance>{
            allAmount: 0,
            freeAmount: 0,
            lockedAmount: 0
        }
    }
};

export const wrongCurrencyBalancesBalances = {
    balanceWithoutAllAmount: {
        field1: 'otherData',
        data: {
            coinType: 'AAA',
            freezeBalance: 100
        }
    },
    balanceWithoutFreezeAmount: {
        field1: 'otherData',
        data: {
            coinType: 'AAA',
            balance: 200
        }
    },
    balanceWithoutCoinType: {
        field1: 'otherData',
        data: {
            balance: 300,
            freezeBalance: 50
        }
    },
    balanceWithWrongAllAmountType: {
        field1: 'otherData',
        data: {
            balance: '300',
            freezeBalance: 50
        }
    },
    balanceWithWrongFreezeAmountType: {
        field1: 'otherData',
        data: {
            balance: 300,
            freezeBalance: '50'
        }
    }
};
