const constants = {
    serverProductionUrl: 'https://api.kucoin.com',
    listExchangeRateOfCoinsUri: '/v1/open/currencies',
    listLanguagesUri: '/v1/open/lang-list',
    tradesUri: '/v1/open/deal-orders',
    tickUri: '/v1/open/tick',
    orderBooksUri: '/v1/open/orders',
    buyOrderBooksUri: '/v1/open/orders-buy',
    sellOrderBooksUri: '/v1/open/orders-sell',
    recentlyDealOrdersUri: '/v1/open/deal-orders',
    listTradingMarketsUri: '/v1/open/markets',
    listTradingSymbolsTickUri: '/v1/market/open/symbols',
    listTrendingsUri: '/v1/market/open/coins-trending',
    getTradingViewKLineConfigUri: '/v1/open/chart/config',
    getTradingViewSymbolTickUri: '/v1/open/chart/symbols',
    getTradingViewKLineDataUri: '/v1/open/chart/history',
    getCoinInfoUri: '/v1/market/open/coin-info',
    listCoinsUri: '/v1/market/open/coins',
    createOrderUri: '/v1/order',
    deleteOrderUri: '/v1/cancel-order',
    activeOrdersUri: '/v1/order/active',
    orderInfoUri: '/v1/order/detail'
};

export const KuCoinConstants: Readonly<typeof constants> = constants;
