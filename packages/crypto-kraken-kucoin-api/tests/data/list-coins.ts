import { KuCoinListCoins } from 'src';

export const listCoinsCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/public-market-data/list-coins(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1515531600000,
        data: [
            {
                withdrawMinFee: 100000,
                coinType: null,
                txUrl: 'https://blockchain.info/tx/{txId}',
                withdrawMinAmount: 200000,
                withdrawFeeRate: 0.001,
                confirmationCount: 12,
                name: 'Bitcoin',
                tradePrecision: 7,
                coin: 'BTC',
                infoUrl: null,
                enableWithdraw: true,
                enableDeposit: true,
                depositRemark: '',
                withdrawRemark: '',
                enable: true,
                orgAddress: null,
                userAddressName: null
            }
        ]
    } as KuCoinListCoins,
    btcAndEthAndKcs: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1532075492638,
        data: [
            {
                withdrawMinFee: 0.001,
                coinType: null,
                withdrawMinAmount: 0.002,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: 'https://blockchain.info/tx/{txId}',
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 3,
                infoUrl: null,
                enable: true,
                name: 'Bitcoin',
                tradePrecision: 8,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'BTC'
            },
            {
                withdrawMinFee: 0.01,
                coinType: 'ETH',
                withdrawMinAmount: 0.1,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: 'https://etherscan.io/tx/{txId}',
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 12,
                infoUrl: null,
                enable: true,
                name: 'Ethereum',
                tradePrecision: 7,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'ETH'
            },
            {
                withdrawMinFee: 0.5,
                coinType: 'ERC20',
                withdrawMinAmount: 10,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: 'https://etherscan.io/tx/{txId}',
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 12,
                infoUrl: null,
                enable: true,
                name: 'Kucoin Shares',
                tradePrecision: 4,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'KCS'
            }
        ]
    } as KuCoinListCoins
};

export const wrongListCoinsCases = {
    withoutCoinType: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1532075492638,
        data: [
            {
                withdrawMinFee: 0.001,
                coinType: null,
                withdrawMinAmount: 0.002,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: 'https://blockchain.info/tx/{txId}',
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 3,
                infoUrl: null,
                enable: true,
                name: 'Bitcoin',
                tradePrecision: 8,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'BTC'
            },
            {
                withdrawMinFee: 0.01,
                /* There isn't the coinType field */
                withdrawMinAmount: 0.1,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: 'https://etherscan.io/tx/{txId}',
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 12,
                infoUrl: null,
                enable: true,
                name: 'Ethereum',
                tradePrecision: 7,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'ETH'
            },
            {
                withdrawMinFee: 0.5,
                coinType: 'ERC20',
                withdrawMinAmount: 10,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: 'https://etherscan.io/tx/{txId}',
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 12,
                infoUrl: null,
                enable: true,
                name: 'Kucoin Shares',
                tradePrecision: 4,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'KCS'
            }
        ]
    } as KuCoinListCoins,
    txUrlUndefined: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1532075492638,
        data: [
            {
                withdrawMinFee: 0.001,
                coinType: null,
                withdrawMinAmount: 0.002,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: undefined,
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 3,
                infoUrl: null,
                enable: true,
                name: 'Bitcoin',
                tradePrecision: 8,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'BTC'
            },
            {
                withdrawMinFee: 0.01,
                coinType: 'ETH',
                withdrawMinAmount: 0.1,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: 'https://etherscan.io/tx/{txId}',
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 12,
                infoUrl: null,
                enable: true,
                name: 'Ethereum',
                tradePrecision: 7,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'ETH'
            },
            {
                withdrawMinFee: 0.5,
                coinType: 'ERC20',
                withdrawMinAmount: 10,
                withdrawRemark: '',
                orgAddress: null,
                txUrl: 'https://etherscan.io/tx/{txId}',
                userAddressName: null,
                withdrawFeeRate: 0.001,
                confirmationCount: 12,
                infoUrl: null,
                enable: true,
                name: 'Kucoin Shares',
                tradePrecision: 4,
                depositRemark: null,
                enableWithdraw: true,
                enableDeposit: true,
                coin: 'KCS'
            }
        ]
    } as KuCoinListCoins
};
