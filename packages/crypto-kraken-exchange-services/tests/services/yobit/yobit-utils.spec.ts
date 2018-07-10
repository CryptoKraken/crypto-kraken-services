import { expect } from 'chai';
import { YobitUtils } from '../../../src/services/yobit/yobit-rest-v3/yobit-utils';

describe('YobitUtils', () => {
    it('should generate a pair symbol correctly', () => {
        expect(YobitUtils.getPairSymbol(['eth', 'btc'])).to.be.eql('eth_btc');
        expect(YobitUtils.getPairSymbol(['ETH', 'BTC'])).to.be.eql('eth_btc');
    });
});
