const constants = {
    serverProductionUrl: 'https://api.kucoin.com',
    listExchangeRateOfCoinsUri: '/v1/open/currencies',
    tradesUri: '/v1/open/deal-orders',
    tickUri: '/v1/open/tick',
    orderBooksUri: '/v1/open/orders',
    buyOrderBooksUri: '/v1/open/orders-buy',
    sellOrderBooksUri: '/v1/open/orders-sell',
    createOrderUri: '/v1/order',
    deleteOrderUri: '/v1/cancel-order',
    activeOrdersUri: '/v1/order/active',
    orderInfoUri: '/v1/order/detail'
};

export const KuCoinConstants: Readonly<typeof constants> = constants;
