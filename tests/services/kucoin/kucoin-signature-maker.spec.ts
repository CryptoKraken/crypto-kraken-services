import { expect } from 'chai';
import { KuCoinSignatureMaker } from '../../../src/services/kucoin/kucoin-signature-maker';
import { exchangeCredentialsCases } from './data/exchange-credentials';

describe('KuCoin Signature Maker', () => {
    let kuCoinSignatureMaker: KuCoinSignatureMaker;

    beforeEach(() => {
        kuCoinSignatureMaker = new KuCoinSignatureMaker();
    });

    it('should sign correctly', () => {
        const currentCredentials = exchangeCredentialsCases[0];
        const endpoint = '/v1/account/balances';
        const nonce = 1506219855000;
        const queryString = '?limit=15';
        const expectedSignature = '6e5cb82abea3ca77e974af3069bdad91d3a34a09314594d56edb749d7e139adf';
        const expectedSignatureWithQueryString = 'c987bc627ef051f2f09a9c1a386f9aad844decdfd739a1ad7b02d7fec9421476';

        const signature = kuCoinSignatureMaker.sign(currentCredentials.secret, endpoint, undefined, nonce);
        const signatureWithQueryString = kuCoinSignatureMaker.sign(
            currentCredentials.secret, endpoint, queryString, nonce
        );

        expect(kuCoinSignatureMaker.sign(currentCredentials.secret, endpoint, undefined)).to.not.be.empty;
        expect(signature).to.not.eql(signatureWithQueryString);
        expect(signature).to.eql(expectedSignature);
        expect(signatureWithQueryString).to.eql(expectedSignatureWithQueryString);
    });

    it('should return different signatures when parameters is different', () => {
        const endpoints = ['/v1/user/info', '/v1/account/balances'];
        const nonces = [1515531600000, 1527109200000];

        /*
        * signatures[<secretIndex>][<endpointIndex>][<nonceIndex>]
        *
        * secret0 - exchangeCredentialsCases[0].secret
        * |           |    endpoints[0]     |    endpoints[1]     |
        * |            -------------------------------------------
        * | nonces[0] | signatures[0][0][0] | signatures[0][1][0] |
        * | nonces[1] | signatures[0][0][1] | signatures[0][1][1] |
        *
        * secret1 - exchangeCredentialsCases[1].secret
        * |           |    endpoints[0]     |    endpoints[1]     |
        * |            -------------------------------------------
        * | nonces[0] | signatures[1][0][0] | signatures[1][1][0] |
        * | nonces[1] | signatures[1][0][1] | signatures[1][1][1] |
        */
        const signaturesList: string[] = [];
        const signatures = [
            exchangeCredentialsCases[0].secret, // secret0
            exchangeCredentialsCases[1].secret // secret1
        ].map(secret => endpoints
            .map(endpoint => nonces
                .map(nonce => {
                    const signature = kuCoinSignatureMaker.sign(secret, endpoint, undefined, nonce);
                    signaturesList.push(signature);
                    return signature;
                })
            )
        );

        const expectedSignatures = [
            [ // secret0
                [ // endpoints[0]
                    '531ce92aa5d8716da0053afcc65214a34dcdc73cd17f735b99531c10cab2e7bd', // nonces[0]
                    '447523a6d4d3df60d9b1e8c2d2ba8a5dc3cf420bd4de921e5a7e1d9a97b3089f'  // nonces[1]
                ],
                [ // endpoints[1]
                    'da492b2719ee07c658c5cf89376b2fd6220dc1a6ba4a4996de2abf1cfbc4f641', // nonces[0]
                    '5e133c6648a251d9aa66047d5970cf6abd3bdca4a2b9cb6c285197894bafa5b9'  // nonces[1]
                ]
            ],
            [ // secret1
                [ // endpoints[0]
                    '0b9eebe7a184fe6085f206b14c754357be602620f7572d8a3301a485fc51196c', // nonces[0]
                    '4bf6d564fba673df07353c83662dfdb9bc25bc4c1e94c09db7877d4201df1060'  // nonces[1]
                ],
                [ // endpoints[1]
                    '45988fe81562b2ff11fccbfd98f2a910f6c1b579733d69c1b4ee899cf2271fbb', // nonces[0]
                    'c503db2d2a4c9294baf18c8ecde77d6806a343457ce09854edd6d2d406fdb00d'  // nonces[1]
                ]
            ],
        ];

        expect(new Set(signaturesList).size).to.eql(signaturesList.length);
        expect(signatures).to.eql(expectedSignatures);
    });

    it('should sign with different formats of the querystring correctly', () => {
        const currentCredentials = exchangeCredentialsCases[0];
        const endpoint = '/v1/account/active';
        const nonce = 1506219855000;
        const queryString = '?symbol=AAA-BBB&limit=15';
        const queryStringObj = {
            symbol: 'AAA-BBB',
            limit: 15
        };
        const expectedSignature = '55d13353b23c13e1f38d62e8c49b2d40ea55b5308c5829de971df0e8a9c90fa2';

        const signature1 = kuCoinSignatureMaker.sign(currentCredentials.secret, endpoint, queryString, nonce);
        const signature2 = kuCoinSignatureMaker.sign(currentCredentials.secret, endpoint, queryStringObj, nonce);

        expect(signature1)
            .to.eql(signature2)
            .to.eql(expectedSignature);
    });
});
