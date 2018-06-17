import * as request from 'request-promise-native';
import {
    AuthenticatedRestExchangeService, CurrencyBalance, CurrencyPair,
    Order, OrderBook, OrderInfo, RestExchangeService
} from '../../core';
import { Identified, RepeatPromise } from '../../utils';
import { YobitConstants } from './constants';
import { YobitExchangeCredentials } from './yobit-exchange-credentials';
import { yobitNonceFactory } from './yobit-nonce-factory';
import { YobitResponseParser } from './yobit-response-parser';
import { YobitSignatureMaker } from './yobit-signature-maker';
import { YobitUtils } from './yobit-utils';

export class YobitService implements RestExchangeService, AuthenticatedRestExchangeService {
    private responseParser: YobitResponseParser = new YobitResponseParser();
    private _signatureMaker: YobitSignatureMaker = new YobitSignatureMaker();
    private _nonceFactory: () => Promise<number> | number = yobitNonceFactory;
    private _rootServerUrl: string = YobitConstants.rootServerUrl;
    private _requestTryCount: number;

    constructor(requestTryCount: number = 3) {
        this._requestTryCount = requestTryCount;
    }

    get rootServerUrl(): string {
        return this._rootServerUrl;
    }

    set rootServerUrl(value: string) {
        this._rootServerUrl = value;
    }

    get signatureMaker(): YobitSignatureMaker {
        return this._signatureMaker;
    }

    set signatureMaker(value: YobitSignatureMaker) {
        this._signatureMaker = value;
    }

    get nonceFactory(): () => Promise<number> | number {
        return this._nonceFactory;
    }

    set nonceFactory(value: () => Promise<number> | number) {
        this._nonceFactory = value;
    }

    get requestTryCount() {
        return this._requestTryCount;
    }

    set requestTryCount(value: number) {
        this._requestTryCount = value;
    }

    getOrderBook(pair: CurrencyPair, maxLimit?: number): Promise<OrderBook> {
        return new RepeatPromise((resolve, reject) => {
            request.get(YobitConstants.getOrderBookUri(pair), {
                baseUrl: YobitConstants.getRootPublicApiUrl(this.rootServerUrl),
                qs: maxLimit ? { limit: maxLimit } : undefined
            })
                .then(value => resolve(this.responseParser.parseOrderBook(value, pair)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    getTrades(pair: CurrencyPair, maxLimit?: number): Promise<Order[]> {
        return new RepeatPromise((resolve, reject) => {
            request.get(YobitConstants.getTradesUri(pair), {
                baseUrl: YobitConstants.getRootPublicApiUrl(this.rootServerUrl),
                qs: maxLimit ? { limit: maxLimit } : undefined
            })
                .then(value => resolve(this.responseParser.parseTrades(value, pair)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    async createOrder(order: Order, exchangeCredentials: YobitExchangeCredentials): Promise<Identified<Order>> {
        const params = {
            method: YobitConstants.createOrderMethod,
            nonce: await this.nonceFactory(),
            pair: YobitUtils.getPairSymbol(order.pair),
            type: YobitUtils.getOrderTypeSymbol(order.orderType),
            rate: order.price,
            amount: order.amount
        };

        const authHeaders = await this.getAuthHeaders(exchangeCredentials, params);
        const response = await request.post('/', {
            baseUrl: YobitConstants.getRootPrivateApiUrl(this.rootServerUrl),
            headers: authHeaders,
            form: params
        });

        return this.responseParser.parseCreateOrder(response, order);
    }

    deleteOrder(identifiedOrder: Identified<Order>, exchangeCredentials: YobitExchangeCredentials): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getOrderInfo(
        identifiedOrder: Identified<Order>,
        exchangeCredentials: YobitExchangeCredentials
    ): Promise<OrderInfo> {
        throw new Error('Method not implemented.');
    }
    getActiveOrders(
        pair: CurrencyPair,
        exchangeCredentials: YobitExchangeCredentials
    ): Promise<Array<Identified<Order>>> {
        throw new Error('Method not implemented.');
    }

    getBalance(currency: string, exchangeCredentials: YobitExchangeCredentials): Promise<CurrencyBalance> {
        return new RepeatPromise(async (resolve, reject) => {
            const params = {
                method: YobitConstants.balanceMethod,
                nonce: await this.nonceFactory()
            };

            const authHeaders = this.getAuthHeaders(exchangeCredentials, params);
            request.post('/', {
                baseUrl: YobitConstants.getRootPrivateApiUrl(this.rootServerUrl),
                headers: authHeaders,
                form: params
            })
                .then(value => resolve(this.responseParser.parseBalance(value, currency)))
                .catch(reason => reject(reason));
        }, this.requestTryCount);
    }

    private getAuthHeaders(
        exchangeCredentials: YobitExchangeCredentials,
        params: { [key: string]: string | number }
    ) {
        return {
            Key: exchangeCredentials.apiKey,
            Sign: this.signatureMaker.sign(exchangeCredentials.secret, params),
        };
    }
}
