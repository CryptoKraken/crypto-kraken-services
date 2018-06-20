import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    exchangeCredentials: {
        apiKey: process.env.KUCOIN_API_KEY || '',
        secret: process.env.KUCOIN_API_SECRET || ''
    }
};

export const testsConfig: Readonly<typeof config> = config;
