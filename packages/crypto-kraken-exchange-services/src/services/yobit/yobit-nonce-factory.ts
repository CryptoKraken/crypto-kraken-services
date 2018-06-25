// The Yobit restrictions (from https://yobit.net/en/api/):
// (1 minimum to 2147483646 maximum) in succeeding request should exceed that in the previous one.
// To null nonce it is necessary to generate new key.

export const yobitNonceMinValue = 1;
export const yobitNonceMaxValue = 2147483646;
export const yobitNonceFactory = () => generateYobitNonce(Date.now());

// Allows generating a new nonce for every 100 milliseconds.
export const generateYobitNonce = (timestamp: number) => {
    return ((timestamp / 100) % (yobitNonceMaxValue - yobitNonceMinValue)) + yobitNonceMinValue;
};
