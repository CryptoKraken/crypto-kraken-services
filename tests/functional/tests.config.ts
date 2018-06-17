import * as dotenv from 'dotenv';
dotenv.config();

const config = {
    exchangeCredentials: {
        kuCoin: {
            apiKey: process.env.KUCOIN_API_KEY || '',
            secret: process.env.KUCOIN_API_SECRET || ''
        },
        yobit: {
            apiKey: process.env.YOBIT_API_KEY || '',
            secret: process.env.YOBIT_API_SECRET || ''
        }
    }
};

export const testsConfig: Readonly<typeof config> = config;
