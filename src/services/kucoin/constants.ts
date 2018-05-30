const constants = {
    serverProductionUrl: 'https://api.kucoin.com',
    tradesUri: '/v1/open/deal-orders',
    orderBooksUri: '/v1/open/orders'
};

export const KuCoinConstants: Readonly<typeof constants> =  constants;
