import { KuCoinListExchangeRateOfCoins } from 'src';

export const listExchangeRateOfCoinsCases = {
    /*
        This case from the KuCoin documentation
        https://kucoinapidocs.docs.apiary.io/#reference/0/currencies-plugin/list-exchange-rate-of-coins(open)
    */
    default: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1508049552782,
        data: {
            currencies: [
                ['USD', '$'],
                ['EUR', '€'],
                ['CNY', '¥'],
                ['JPY', '¥'],
                ['CHF', 'CHF'],
                ['HKD', '$'],
                ['GBP', '£'],
                ['RUB', '₽'],
                ['AUD', '$']
            ],
            rates: {
                BTC: {
                    AUD: 7377.67,
                    CHF: 5642.31,
                    HKD: 45111.9,
                    JPY: 648153.6,
                    EUR: 4892.29,
                    GBP: 4353.16,
                    USD: 5777.8,
                    RUB: 333263.5,
                    CNY: 38077.43
                }
            }
        }
    } as KuCoinListExchangeRateOfCoins,
    btcAndEth: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530705280629,
        data: {
            currencies: [
                ['USD', '$'],
                ['EUR', '€'],
                ['AUD', '$'],
                ['CAD', '$'],
                ['CHF', 'CHF'],
                ['CNY', '¥'],
                ['GBP', '£'],
                ['JPY', '¥'],
                ['NZD', '$'],
                ['BGN', 'лв.'],
                ['BRL', 'R$'],
                ['CZK', 'Kč'],
                ['DKK', 'kr'],
                ['HKD', '$'],
                ['HRK', 'kn'],
                ['HUF', 'Ft'],
                ['IDR', 'Rp'],
                ['ILS', '₪'],
                ['INR', '₹'],
                ['KRW', '₩'],
                ['MXN', '$'],
                ['MYR', 'RM'],
                ['NOK', 'kr'],
                ['PHP', '₱'],
                ['PLN', 'zł'],
                ['RON', 'lei'],
                ['RUB', '₽'],
                ['SEK', 'kr'],
                ['SGD', '$'],
                ['THB', '฿'],
                ['TRY', '₺'],
                ['ZAR', 'R']
            ],
            rates: {
                BTC: {
                    CHF: 6471.95,
                    HRK: 41298.89,
                    MXN: 127118.68,
                    ZAR: 89092.78,
                    INR: 447463.66,
                    CNY: 43281.07,
                    THB: 216173.59,
                    AUD: 8808.86,
                    ILS: 23814.35,
                    KRW: 7286962.74,
                    JPY: 720907.39,
                    PLN: 24595.2,
                    GBP: 4943.91,
                    IDR: 93755745.27,
                    HUF: 1830783.35,
                    PHP: 348251.87,
                    TRY: 30492.8,
                    RUB: 411601.47,
                    HKD: 51216.29,
                    EUR: 5594.68,
                    DKK: 41698.65,
                    USD: 6528.95,
                    CAD: 8568.6,
                    MYR: 26409.83,
                    BGN: 10947.07,
                    NOK: 53060.86,
                    RON: 26062.9,
                    SGD: 8900.13,
                    CZK: 146136.85,
                    SEK: 57626.22,
                    NZD: 9638.71,
                    BRL: 25422.43
                },
                ETH: {
                    CHF: 460.81,
                    HRK: 2940.56,
                    MXN: 9051.11,
                    ZAR: 6343.59,
                    INR: 31860.36,
                    CNY: 3081.7,
                    THB: 15392.01,
                    AUD: 627.21,
                    ILS: 1695.63,
                    KRW: 518847.19,
                    JPY: 51330.13,
                    PLN: 1751.23,
                    GBP: 352.01,
                    IDR: 6675607.82,
                    HUF: 130355.65,
                    PHP: 24796.27,
                    TRY: 2171.15,
                    RUB: 29306.89,
                    HKD: 3646.7,
                    EUR: 398.35,
                    DKK: 2969.03,
                    USD: 464.87,
                    CAD: 610.1,
                    MYR: 1880.43,
                    BGN: 779.45,
                    NOK: 3778.04,
                    RON: 1855.73,
                    SGD: 633.7,
                    CZK: 10405.25,
                    SEK: 4103.1,
                    NZD: 686.29,
                    BRL: 1810.13
                }
            }
        }
    } as KuCoinListExchangeRateOfCoins,
    unknownCoin: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1530707328406,
        data: {
            currencies: [
                ['USD', '$'],
                ['EUR', '€'],
                ['AUD', '$'],
                ['CAD', '$'],
                ['CHF', 'CHF'],
                ['CNY', '¥'],
                ['GBP', '£'],
                ['JPY', '¥'],
                ['NZD', '$'],
                ['BGN', 'лв.'],
                ['BRL', 'R$'],
                ['CZK', 'Kč'],
                ['DKK', 'kr'],
                ['HKD', '$'],
                ['HRK', 'kn'],
                ['HUF', 'Ft'],
                ['IDR', 'Rp'],
                ['ILS', '₪'],
                ['INR', '₹'],
                ['KRW', '₩'],
                ['MXN', '$'],
                ['MYR', 'RM'],
                ['NOK', 'kr'],
                ['PHP', '₱'],
                ['PLN', 'zł'],
                ['RON', 'lei'],
                ['RUB', '₽'],
                ['SEK', 'kr'],
                ['SGD', '$'],
                ['THB', '฿'],
                ['TRY', '₺'],
                ['ZAR', 'R']
            ],
            rates: []
        }
    } as any as KuCoinListExchangeRateOfCoins
};

export const wrongListExchangeRateOfCoinsCases = {
    currencyWithMissingSymbol: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1508049552782,
        data: {
            currencies: [
                ['USD', '$'],
                ['EUR', '€'],
                ['CNY', '¥'],
                ['JPY', /* Missing required element */],
                ['CHF', 'CHF'],
                ['HKD', '$'],
                ['GBP', '£'],
                ['RUB', '₽'],
                ['AUD', '$']
            ],
            rates: {
                BTC: {
                    AUD: 7377.67,
                    CHF: 5642.31,
                    HKD: 45111.9,
                    JPY: 648153.6,
                    EUR: 4892.29,
                    GBP: 4353.16,
                    USD: 5777.8,
                    RUB: 333263.5,
                    CNY: 38077.43
                }
            }
        }
    } as any as KuCoinListExchangeRateOfCoins,
    dataWithWrongCurrenciesFieldName: {
        success: true,
        code: 'OK',
        msg: 'Operation succeeded.',
        timestamp: 1508049552782,
        data: {
            // The field name is wrong, it should be 'currencies'
            currencies1: [
                ['USD', '$'],
                ['EUR', '€'],
                ['CNY', '¥'],
                ['JPY', '¥'],
                ['CHF', 'CHF'],
                ['HKD', '$'],
                ['GBP', '£'],
                ['RUB', '₽'],
                ['AUD', '$']
            ],
            rates: {
                BTC: {
                    AUD: 7377.67,
                    CHF: 5642.31,
                    HKD: 45111.9,
                    JPY: 648153.6,
                    EUR: 4892.29,
                    GBP: 4353.16,
                    USD: 5777.8,
                    RUB: 333263.5,
                    CNY: 38077.43
                }
            }
        }
    } as any as KuCoinListExchangeRateOfCoins
};
