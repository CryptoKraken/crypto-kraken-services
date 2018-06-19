import { expect } from 'chai';
import { YobitSignatureMaker } from '../../../src/services/yobit/yobit-signature-maker';

describe('Yobit signature maker', () => {
    let signatureMaker: YobitSignatureMaker;

    beforeEach(() => {
        signatureMaker = new YobitSignatureMaker();
    });

    it('should sign message correctly', () => {
        const signature = signatureMaker.sign('TestSecretKey', {
            method: 'testMethod',
            nonce: 12433,
            additionalParameter: 'parameterValue'
        });
        // tslint:disable-next-line:max-line-length
        expect(signature).to.eql('b1197ab30c59f60fac83b8bf60b577546146f3ea94e5ffdda86f2c300d18d7a490dd22291079ce6f014d51703fa9e302729e391b94f5be5c050aad09e95c9243');
    });

    it('should return different signatures for different parameters', () => {
        const secretKey = 'TestSecretKey';
        const signature1 = signatureMaker.sign(secretKey, { a: 1, b: 'value1' });
        const signature2 = signatureMaker.sign(secretKey, { a: 2, b: 'value2' });
        expect(signature1).not.to.eql(signature2);
    });

    it('should return different signatures for different secret keys', () => {
        const parameters = { a: 1, b: 'value1' };
        const signature1 = signatureMaker.sign('TestSecretKey1', parameters);
        const signature2 = signatureMaker.sign('TestSecretKey2', parameters);
        expect(signature1).not.to.eql(signature2);
    });
});
