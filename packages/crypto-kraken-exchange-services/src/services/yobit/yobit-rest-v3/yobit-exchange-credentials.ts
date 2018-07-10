import { ExchangeCredentials } from '../../../core';

export interface YobitExchangeCredentials extends ExchangeCredentials {
    apiKey: string;
    secret: string;
}
