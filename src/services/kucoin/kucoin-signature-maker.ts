import * as crypto from 'crypto';
import { Buffer } from 'buffer';

export class KuCoinSignatureMaker {
    sign(secretKey: string, apiEndpoint: string, queryString: string | undefined, timestamp = Date.now()) {
        let stringForSign = `${apiEndpoint}/${timestamp}/`;
        if (queryString)
            stringForSign += `${queryString}`;

        const signatureString = new Buffer(stringForSign).toString('base64');
        return crypto.createHmac('sha256', secretKey)
            .update(signatureString)
            .digest('hex');
    }
}