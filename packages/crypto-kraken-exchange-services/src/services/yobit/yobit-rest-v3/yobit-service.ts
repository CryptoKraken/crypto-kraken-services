import * as request from 'request-promise-native';
import {
    AuthenticatedRestExchangeService, CurrencyBalance, CurrencyPair,
    Order, OrderBook, OrderInfo, RestExchangeService
} from '../../../core';
import { Identified } from '../../../utils';
import { YobitConstants } from './constants';
import { YobitExchangeCredentials } from './yobit-exchange-credentials';
import { yobitNonceFactory } from './yobit-nonce-factory';
import { YobitResponseParser } from './yobit-response-parser';
import { YobitSignatureMaker } from './yobit-signature-maker';
import { YobitUtils } from './yobit-utils';

export class YobitRestV3 implements RestExchangeService, AuthenticatedRestExchangeService {
    private responseParser: YobitResponseParser = new YobitResponseParser();
    private _signatureMaker: YobitSignatureMaker = new YobitSignatureMaker();
    private _nonceFactory: () => Promise<number> | number = yobitNonceFactory;
    private _rootServerUrl: string = YobitConstants.rootServerUrl;

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

    async getOrderBook(pair: CurrencyPair, maxLimit?: number): Promise<OrderBook> {
        const responseResult = await request.get(YobitConstants.getOrderBookUri(pair), {
            baseUrl: YobitConstants.getRootPublicApiUrl(this.rootServerUrl),
            qs: maxLimit ? { limit: maxLimit } : undefined
        });

        return this.responseParser.parseOrderBook(responseResult, pair);
    }

    async getTrades(pair: CurrencyPair, maxLimit?: number): Promise<Order[]> {
        const responseResult = await request.get(YobitConstants.getTradesUri(pair), {
            baseUrl: YobitConstants.getRootPublicApiUrl(this.rootServerUrl),
            qs: maxLimit ? { limit: maxLimit } : undefined
        });

        return this.responseParser.parseTrades(responseResult, pair);
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
        const responseResult = await request.post('/', {
            baseUrl: YobitConstants.getRootPrivateApiUrl(this.rootServerUrl),
            headers: authHeaders,
            form: params
        });

        return this.responseParser.parseCreateOrder(responseResult, order);
    }

    async deleteOrder(
        identifiedOrder: Identified<Order>,
        exchangeCredentials: YobitExchangeCredentials
    ): Promise<void> {
        const params = {
            method: YobitConstants.deleteOrderMethod,
            nonce: await this.nonceFactory(),
            order_id: identifiedOrder.id
        };

        const authHeaders = await this.getAuthHeaders(exchangeCredentials, params);
        const responseResult = await request.post('/', {
            baseUrl: YobitConstants.getRootPrivateApiUrl(this.rootServerUrl),
            headers: authHeaders,
            form: params
        });

        this.responseParser.parseDeleteOrder(responseResult, identifiedOrder.id);
    }

    async getOrderInfo(
        identifiedOrder: Identified<Order>,
        exchangeCredentials: YobitExchangeCredentials
    ): Promise<OrderInfo> {
        throw new Error('Method not implemented.');
    }

    async getActiveOrders(
        pair: CurrencyPair,
        exchangeCredentials: YobitExchangeCredentials
    ): Promise<Array<Identified<Order>>> {
        throw new Error('Method not implemented.');
    }

    async getBalance(currency: string, exchangeCredentials: YobitExchangeCredentials): Promise<CurrencyBalance> {
        const params = {
            method: YobitConstants.balanceMethod,
            nonce: await this.nonceFactory()
        };
        const authHeaders = this.getAuthHeaders(exchangeCredentials, params);
        const responseResult = await request.post('/', {
            baseUrl: YobitConstants.getRootPrivateApiUrl(this.rootServerUrl),
            headers: authHeaders,
            form: params
        });

        return this.responseParser.parseBalance(responseResult, currency);
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
