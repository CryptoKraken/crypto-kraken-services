// The Yobit restrictions (from https://yobit.net/en/api/):
// (1 minimum to 2147483646 maximum) in succeeding request should exceed that in the previous one.
// To null nonce it is necessary to generate new key.

const offset = 1529330410000;
// Allows generating a new nonce for every 100 milliseconds.
export const yobitNonceFactory = () => (Date.now() - offset) / 100;
