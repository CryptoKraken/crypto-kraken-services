const constants = {
    serverProductionUrl: 'https://api.kucoin.com',
    tradesUri: '/v1/open/deal-orders',
    orderBooksUri: '/v1/open/orders',
    createOrderUri: '/v1/order',
    deleteOrderUri: '/v1/cancel-order',
    activeOrdersUri: '/v1/order/active',
    orderInfoUri: '/v1/order/detail',
    getBalanceOfCoinUri: (coin: string) => `/v1/account/${coin}/balance`,
};

export const KuCoinConstants: Readonly<typeof constants> = constants;
