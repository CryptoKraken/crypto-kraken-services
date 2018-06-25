import { expect } from 'chai';
import { generateYobitNonce, yobitNonceMaxValue } from '../../../src/services/yobit/yobit-nonce-factory';

describe('The generateYobitNonce', () => {
    it('should generate a nonce correctly', () => {
        const firstNonce = generateYobitNonce(1529935124961);
        const secondNonce = generateYobitNonce(1529935124962);

        expect(firstNonce).greaterThan(1);
        expect(secondNonce).greaterThan(firstNonce);
        expect(secondNonce).lessThan(yobitNonceMaxValue);
    });

    it('should generate a nonce correctly for a new circle', () => {
        const maxTimeStampForFirstCircle = new Date((yobitNonceMaxValue - 2) * 100).getTime();
        const timeStampForSecondCircle = new Date((yobitNonceMaxValue - 1) * 100).getTime();
        const nextTimeStampForSecondCircle = new Date((yobitNonceMaxValue) * 100).getTime();

        const maxNonceForFirstCircle = generateYobitNonce(maxTimeStampForFirstCircle);
        const nonceForSecondCircle = generateYobitNonce(timeStampForSecondCircle);
        const nextNonceForSecondCircle = generateYobitNonce(nextTimeStampForSecondCircle);

        expect(maxNonceForFirstCircle).to.eql(2147483645);
        expect(nonceForSecondCircle).to.eql(1);
        expect(nextNonceForSecondCircle).to.eql(2);
    });
});
