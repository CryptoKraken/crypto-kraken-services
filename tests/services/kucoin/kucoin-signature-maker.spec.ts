import { expect } from 'chai';
import { KuCoinSignatureMaker } from '../../../src/services/kucoin/kucoin-signature-maker';

describe('KuCoin Signature Maker', () => {
    const apiInfos = {
        0: {
            // The value is from the KuCoin Documentation: https://kucoinapidocs.docs.apiary.io/#introduction/general
            key: '59c5ecfe18497f5394ded813',
            secret: 'fc9ta6sk-78dg-5zb6-u46c-erg84xk4p8bd'
        }
    }
    let kuCoinSignatureMaker: KuCoinSignatureMaker;

    beforeEach(() => {
        kuCoinSignatureMaker = new KuCoinSignatureMaker();
    });

    it('should be sign correctly', () => {
        const currentApiInfo = apiInfos[0];
        const endpoint = '/v1/user/info';
        const nonce = 1506219855000;
        const expectedSignature = '4bdc9b4cfff9eabb884b14d2d790d3ec0e4869b753719e9b0ccde381e0ab79c1';

        const signature = kuCoinSignatureMaker.sign(currentApiInfo.secret, endpoint, undefined, nonce);

        expect(signature).to.eql(expectedSignature);
    });
});