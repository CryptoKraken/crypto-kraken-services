import { expect } from 'chai';
import * as nock from 'nock';
import { YobitService } from '../../../src/services/yobit';
import { YobitConstants } from '../../../src/services/yobit/constants';
import { YobitSignatureMaker } from '../../../src/services/yobit/yobit-signature-maker';
import { balanceCases, orderBookCases, tradesCases } from './data';

describe('Yobit Exchange Service', () => {
    const orderBookPostfix = YobitConstants.getOrderBookUri(['ltc', 'btc']);
    const tradesUrlPostfix = YobitConstants.getTradesUri(['ltc', 'btc']);
    let exchangeService: YobitService;

    beforeEach(() => {
        exchangeService = new YobitService();
    });

    it('should get an order book', async () => {
        nock(YobitConstants.rootPublicApiUrl)
            .get(orderBookPostfix)
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc']);
        expect(result).to.eql(orderBookCases.default.expected);
    });

    it('should get an order book by the second request (the first request causes an error)', async () => {
        nock(YobitConstants.rootPublicApiUrl)
            .get(orderBookPostfix)
            .reply(500)
            .get(orderBookPostfix)
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc']);
        expect(result).to.eql(orderBookCases.default.expected);
    });

    it('should pass query parameters for getting an order book with applied maxLimit', async () => {
        nock(YobitConstants.rootPublicApiUrl)
            .get(orderBookPostfix)
            .query({ limit: 4 })
            .reply(200, JSON.stringify(orderBookCases.default.data));

        const result = await exchangeService.getOrderBook(['ltc', 'btc'], 4);
        expect(result).to.eql(orderBookCases.default.expected);
    });

    it('should get trades', async () => {
        nock(YobitConstants.rootPublicApiUrl)
            .get(tradesUrlPostfix)
            .reply(200, JSON.stringify(tradesCases.default.data));

        const result = await exchangeService.getTrades(['ltc', 'btc']);
        expect(result).to.eql(tradesCases.default.expected);
    });

    it('should get trades by the second request (the first request causes an error)', async () => {
        nock(YobitConstants.rootPublicApiUrl)
            .get(tradesUrlPostfix)
            .reply(500)
            .get(tradesUrlPostfix)
            .reply(200, JSON.stringify(tradesCases.default.data));

        const result = await exchangeService.getTrades(['ltc', 'btc']);
        expect(result).to.eql(tradesCases.default.expected);
    });

    it('should pass query parameters for getting trades with applied maxLimit', async () => {
        nock(YobitConstants.rootPublicApiUrl)
            .get(tradesUrlPostfix)
            .query({ limit: 4 })
            .reply(200, JSON.stringify(tradesCases.default.data));

        const result = await exchangeService.getTrades(['ltc', 'btc'], 4);
        expect(result).to.eql(tradesCases.default.expected);
    });

    const getAuthRequestHeaders = (key: string, sign: string) => ({
        key,
        sign
    });

    it('should allow to replace a default signature maker', async () => {
        class TestSignatureMaker extends YobitSignatureMaker {
            sign(
                secretKey: string,
                params: { [key: string]: string | number },
            ): string {
                return 'SSS';
            }
        }

        exchangeService.signatureMaker = new TestSignatureMaker();
        exchangeService.nonceFactory = () => 1;

        nock(YobitConstants.rootPrivateApiUrl, {
            reqheaders: getAuthRequestHeaders('AAA', 'SSS')
        })
            .post('/', {
                method: YobitConstants.balanceMethod,
                nonce: 1
            })
            .reply(200, JSON.stringify(balanceCases.defaultLtcBalance.data));

        const result = await exchangeService.getBalance('ltc', {
            apiKey: 'AAA',
            secret: 'BBB'
        });
        expect(result).to.eql(balanceCases.defaultLtcBalance.expect);
    });

    it('should get a balance', async () => {
        nock(YobitConstants.rootPrivateApiUrl, {
            // tslint:disable-next-line:max-line-length
            reqheaders: getAuthRequestHeaders('AAA', '0045ffa68a6a605d9d23a066efaef24a1bcfbd8de3b4b595fc09b831f91ce6bd2bb6be8aadb64a2e67af29b9a2d3ca56299d76633486889e1c92513c9f2b74af')
        })
            .post('/', {
                method: YobitConstants.balanceMethod,
                nonce: 1
            })
            .reply(200, JSON.stringify(balanceCases.defaultLtcBalance.data));

        exchangeService.nonceFactory = () => 1;
        const result = await exchangeService.getBalance('ltc', {
            apiKey: 'AAA',
            secret: 'BBB'
        });
        expect(result).to.eql(balanceCases.defaultLtcBalance.expect);
    });

    it('should get a balance by the second request (the first request causes an error)', async () => {
        nock(YobitConstants.rootPrivateApiUrl, {
            // tslint:disable-next-line:max-line-length
            reqheaders: getAuthRequestHeaders('AAA', '0045ffa68a6a605d9d23a066efaef24a1bcfbd8de3b4b595fc09b831f91ce6bd2bb6be8aadb64a2e67af29b9a2d3ca56299d76633486889e1c92513c9f2b74af')
        })
            .post('/', {
                method: YobitConstants.balanceMethod,
                nonce: 1
            })
            .reply(500)
            .post('/', {
                method: YobitConstants.balanceMethod,
                nonce: 1
            })
            .reply(200, JSON.stringify(balanceCases.defaultLtcBalance.data));

        exchangeService.nonceFactory = () => 1;
        const result = await exchangeService.getBalance('ltc', {
            apiKey: 'AAA',
            secret: 'BBB'
        });
        expect(result).to.eql(balanceCases.defaultLtcBalance.expect);
    });
});
