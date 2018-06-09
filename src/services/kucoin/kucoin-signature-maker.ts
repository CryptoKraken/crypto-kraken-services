import createHmac = require('create-hmac');
import * as qs from 'qs';
import { Buffer } from 'safe-buffer';

export class KuCoinSignatureMaker {
    private readonly _queryStringStringifyOptions: qs.IStringifyOptions = {};

    get queryStringStringifyOptions() {
        return this._queryStringStringifyOptions;
    }

    sign(
        secretKey: string, apiEndpoint: string, queryString: object | string | undefined, timestamp = Date.now()
    ): string {
        let stringForSign = `${apiEndpoint}/${timestamp}/`;
        if (queryString)
            stringForSign += typeof queryString === 'string' ?
                queryString : qs.stringify(queryString, this.queryStringStringifyOptions);

        const signatureString = new Buffer(stringForSign).toString('base64');
        return createHmac('sha256', secretKey)
            .update(signatureString)
            .digest('hex');
    }
}
