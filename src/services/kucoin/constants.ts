const constants = {
    serverProductionUrl: 'https://api.kucoin.com',
    tradesUri: '/v1/open/deal-orders',
    orderBooksUri: '/v1/open/orders',
    getBalanceOfCoinUri: (coin: string) => `/v1/account/${coin}/balance`,
};

export const KuCoinConstants: Readonly<typeof constants> = constants;
