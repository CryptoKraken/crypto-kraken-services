import createHmac = require('create-hmac');
import { Buffer } from 'safe-buffer';

export class KuCoinSignatureMaker {
    sign(secretKey: string, apiEndpoint: string, queryString: string | undefined, timestamp = Date.now()): string {
        let stringForSign = `${apiEndpoint}/${timestamp}/`;
        if (queryString)
            stringForSign += `${queryString}`;

        const signatureString = new Buffer(stringForSign).toString('base64');
        return createHmac('sha256', secretKey)
            .update(signatureString)
            .digest('hex');
    }
}
