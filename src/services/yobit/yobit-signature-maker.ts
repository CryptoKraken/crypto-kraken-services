import createHmac = require('create-hmac');

export class YobitSignatureMaker {
    sign(
        secretKey: string,
        params: { [key: string]: string | number },
    ): string {
        const paramsForSignArray: string[] = [];
        for (const key in params)
            if (params.hasOwnProperty(key))
                paramsForSignArray.push(`${key}=${params[key]}`);

        const paramsForSignString = `${paramsForSignArray.join('&')}`;
        return createHmac('sha512', secretKey)
            .update(paramsForSignString)
            .digest('hex');
    }
}
