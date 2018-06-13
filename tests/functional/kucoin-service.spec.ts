import { expect } from 'chai';
import { KuCoinExchangeCredentials, KuCoinService } from '../../src/index';
import * as environment from './test-utils/environment';

describe('The KuCoin service', () => {
    let kuCoinService: KuCoinService;
    let kuCoinExchangeCredentials: KuCoinExchangeCredentials;

    before(() => {
        const config = environment.load();
        if (!config)
            throw new Error('The config is not loaded');
        kuCoinService = new KuCoinService();
        kuCoinExchangeCredentials = {
            apiKey: config.KUCOIN_API_KEY,
            secret: config.KUCOIN_API_SECRET
        };
    });

    it('should get a balance of coin correctly', async () => {
        const balance = await kuCoinService.getBalance('BTC', kuCoinExchangeCredentials);

        expect(balance.allAmount)
            .to.eql(balance.freeAmount)
            .to.eql(balance.lockedAmount)
            .to.eql(0);
    });
});
