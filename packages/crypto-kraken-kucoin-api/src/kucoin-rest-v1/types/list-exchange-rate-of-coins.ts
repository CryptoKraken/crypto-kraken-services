import { FieldGuardsMap, isArray } from 'crypto-kraken-core';
import { KuCoinSuccessResponseResult, kuCoinSuccessResponseResultGuardsMap } from './success-response-result';

export interface KuCoinListExchangeRateOfCoins<K extends keyof any = string> extends KuCoinSuccessResponseResult {
    data: {
        currencies: Array<[
            /* Currency name */ string,
            /* Currency symbol */ string
        ]>,
        rates: {
            [P in K]: {
                [currencyName: string]: number
            }
        }
    };
}

export const kuCoinListExchangeRateOfCoinsGuardsMap: FieldGuardsMap<KuCoinListExchangeRateOfCoins> = {
    ...kuCoinSuccessResponseResultGuardsMap,
    data: {
        currencies: {
            this: isArray,
            every: (value: any): value is KuCoinListExchangeRateOfCoins['data']['currencies'][0] => {
                return typeof value[0] === 'string' && typeof value[1] === 'string';
            }
        },
        rates: (value: any): value is KuCoinListExchangeRateOfCoins['data']['rates'] => {
            /*
                When we request a rate of an unknown/wrong coin, KuCoin gives us a data with the empty 'rates' field,
                whose type is array, that is, the 'rates' field is an empty array.
                So we check a value here for an empty array, and if so, then we return true.
            */
            if (Array.isArray(value) && !value.length)
                return true;
            return value && Object.getOwnPropertyNames(value).every(cryptoName => {
                return value[cryptoName] && Object.getOwnPropertyNames(value[cryptoName]).every(currencyName => {
                    return typeof value[cryptoName][currencyName] === 'number';
                });
            });
        }
    }
};
