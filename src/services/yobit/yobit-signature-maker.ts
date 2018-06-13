import createHmac = require('create-hmac');
import * as qs from 'qs';

export class YobitSignatureMaker {
    sign(
        secretKey: string,
        params: { [key: string]: string | number },
    ): string {
        const paramsForSignString = qs.stringify(params, { addQueryPrefix: false });
        return createHmac('sha512', secretKey)
            .update(paramsForSignString)
            .digest('hex');
    }
}
