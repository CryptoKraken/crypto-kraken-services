import { ExchangeCredentials } from '../../core';

export interface KuCoinExchangeCredentials extends ExchangeCredentials {
    apiKey: string;
    secret: string;
}

export interface KuCoinAuthRequestHeaders {
    ['KC-API-KEY']: string;
    ['KC-API-NONCE']: number;
    ['KC-API-SIGNATURE']: string;
}
